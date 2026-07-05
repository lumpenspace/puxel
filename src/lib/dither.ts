/**
 * Renders a pixelated, ordered-dithered (4x4 Bayer) duotone of an <img> into
 * a <canvas>, using two theme colors, and can reveal the true image via the
 * `progress` uniform (0 = full dither, 1 = full image) — driven by
 * <Figure dither> on hover. Rather than a uniform crossfade, each grid cell
 * gets its own random start time and "pops": first its color unmixes from
 * the duotone back to real color, then it sharpens from a coarse block to
 * full per-pixel resolution — so cells visibly swap in, at random, at
 * increasing definition, rather than the whole image fading uniformly.
 */

const VERTEX_SHADER = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_cell;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform float u_progress;
varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float bayerValue(vec2 p) {
  float x = mod(p.x, 4.0);
  float y = mod(p.y, 4.0);
  float idx = x + y * 4.0;
  if (idx < 0.5) return 0.0;
  if (idx < 1.5) return 8.0;
  if (idx < 2.5) return 2.0;
  if (idx < 3.5) return 10.0;
  if (idx < 4.5) return 12.0;
  if (idx < 5.5) return 4.0;
  if (idx < 6.5) return 14.0;
  if (idx < 7.5) return 6.0;
  if (idx < 8.5) return 3.0;
  if (idx < 9.5) return 11.0;
  if (idx < 10.5) return 1.0;
  if (idx < 11.5) return 9.0;
  if (idx < 12.5) return 15.0;
  if (idx < 13.5) return 7.0;
  if (idx < 14.5) return 13.0;
  return 5.0;
}

void main() {
  vec2 fragCoord = v_uv * u_resolution;
  vec2 coarseIdx = floor(fragCoord / u_cell);

  // Each coarse cell gets its own start time, spread across the first 70%
  // of progress, and a 30%-wide personal window to pop in — so cells swap
  // in at random one at a time rather than the whole image fading at once,
  // and every cell is guaranteed to finish (local == 1) by progress == 1.
  float start = hash(coarseIdx) * 0.7;
  float local = clamp((u_progress - start) / 0.3, 0.0, 1.0);

  // Within a cell's own window, color unmixes back to real first (still a
  // coarse block); only then does that block sharpen to full resolution.
  float colorProgress = clamp(local / 0.5, 0.0, 1.0);
  float resProgress = clamp((local - 0.5) / 0.5, 0.0, 1.0);
  float cell = mix(u_cell, 1.0, resProgress);

  vec2 cellIdx = floor(fragCoord / cell);
  vec2 sampleCoord = (cellIdx + 0.5) * cell;
  vec2 sampleUv = sampleCoord / u_resolution;
  vec4 pixelated = texture2D(u_image, vec2(sampleUv.x, 1.0 - sampleUv.y));
  float lum = dot(pixelated.rgb, vec3(0.299, 0.587, 0.114));
  float threshold = (bayerValue(cellIdx) + 0.5) / 16.0;
  float mixv = step(threshold, lum);
  vec3 duotone = mix(u_colorA, u_colorB, mixv);
  vec3 color = mix(duotone, pixelated.rgb, colorProgress);
  gl_FragColor = vec4(color, pixelated.a);
}
`;

function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int = Number.parseInt(full, 16);
  if (full.length !== 6 || Number.isNaN(int)) return [0, 0, 0];
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Could not create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }
  return shader;
}

interface DitherSession {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  texture: WebGLTexture;
  uniforms: Record<string, WebGLUniformLocation | null>;
  textureSource: HTMLImageElement | null;
}

const sessions = new WeakMap<HTMLCanvasElement, DitherSession>();

function createSession(canvas: HTMLCanvasElement): DitherSession | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
  if (!gl) return null;

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) throw new Error("Could not create program");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "program link error");
  }
  gl.useProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  if (!texture) throw new Error("Could not create texture");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  const uniforms = {
    u_resolution: gl.getUniformLocation(program, "u_resolution"),
    u_cell: gl.getUniformLocation(program, "u_cell"),
    u_colorA: gl.getUniformLocation(program, "u_colorA"),
    u_colorB: gl.getUniformLocation(program, "u_colorB"),
    u_progress: gl.getUniformLocation(program, "u_progress"),
    u_image: gl.getUniformLocation(program, "u_image"),
  };

  return { gl, program, texture, uniforms, textureSource: null };
}

export function renderDither(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  colorAHex: string,
  colorBHex: string,
  cellPx: number,
  progress = 0,
): void {
  if (!image.naturalWidth || !image.naturalHeight) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (width <= 1 || height <= 1) return;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  try {
    let session = sessions.get(canvas);
    if (!session) {
      const created = createSession(canvas);
      if (!created) return;
      session = created;
      sessions.set(canvas, session);
    }
    const { gl, program, texture, uniforms } = session;

    gl.useProgram(program);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (session.textureSource !== image) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      session.textureSource = image;
    }

    gl.viewport(0, 0, width, height);
    gl.uniform2f(uniforms.u_resolution, width, height);
    gl.uniform1f(uniforms.u_cell, Math.max(1, cellPx * dpr));
    gl.uniform3fv(uniforms.u_colorA, hexToRgb01(colorAHex));
    gl.uniform3fv(uniforms.u_colorB, hexToRgb01(colorBHex));
    gl.uniform1f(uniforms.u_progress, Math.min(1, Math.max(0, progress)));
    gl.uniform1i(uniforms.u_image, 0);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  } catch {
    // Cross-origin taint, unsupported WebGL, etc. — degrade to plain image.
  }
}
