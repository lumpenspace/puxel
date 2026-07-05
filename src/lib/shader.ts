/**
 * PUXEL — hero shader. An animated field (plasma / ripple / waves) evaluated
 * per coarse cell, quantized to a 4-color theme palette with 4x4 Bayer
 * ordered dithering, and removable pixel-by-pixel via the dissolve uniform
 * (Bayer + hash threshold, so cells drop out in the ordered-dither pattern
 * rather than fading). Companion to dither.ts, which does the same trick for
 * <Figure> images; here the "texture" is procedural.
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
uniform vec2 u_resolution;
uniform float u_cell;
uniform float u_time;
uniform float u_pattern;
uniform float u_dissolve;
uniform vec3 u_c0;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
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
  vec2 cellIdx = floor(fragCoord / u_cell);
  vec2 grid = u_resolution / u_cell;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 q = cellIdx / grid * vec2(aspect, 1.0);
  float t = u_time;

  float v;
  if (u_pattern < 0.5) {
    // plasma: classic sin-sum field
    v = sin(q.x * 5.0 + t) + sin(q.y * 6.0 - t * 1.3)
      + sin((q.x + q.y) * 4.0 + t * 0.7)
      + sin(length(q - vec2(aspect * 0.5, 0.5)) * 8.0 - t * 1.1);
    v = v * 0.125 + 0.5;
  } else if (u_pattern < 1.5) {
    // ripple: rings from the center with an angular wobble
    vec2 c = q - vec2(aspect * 0.5, 0.5);
    float ang = atan(c.y, c.x + 0.0001);
    v = 0.5 + 0.5 * sin(length(c) * 16.0 - t * 2.2 + sin(ang * 3.0 + t * 0.8) * 0.7);
  } else {
    // waves: drifting horizontal bands
    v = 0.5 + 0.5 * sin(q.y * 9.0 + sin(q.x * 3.0 + t * 0.9) * 1.6 + t * 1.2);
  }

  // ordered-dither quantize to the 4-color palette
  float b = (bayerValue(cellIdx) + 0.5) / 16.0;
  float level = clamp(floor(v * 4.0 + (b - 0.5) * 1.5), 0.0, 3.0);
  vec3 col = mix(
    mix(u_c0, u_c1, step(0.5, level)),
    mix(u_c2, u_c3, step(2.5, level)),
    step(1.5, level)
  );

  // dissolve: per-cell threshold mixing a coarser Bayer mosaic with a hash,
  // scaled to < 1 so u_dissolve == 1 always clears every cell
  float dth = mix((bayerValue(floor(cellIdx * 0.5)) + 0.5) / 16.0, hash(cellIdx), 0.6) * 0.98;
  float alpha = step(u_dissolve, dth);
  gl_FragColor = vec4(col, alpha);
}
`;

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

export type Rgb01 = [number, number, number];

export interface PixelShaderFrame {
  /** Seconds (already speed-scaled / quantized by the caller). */
  time: number;
  /** CSS px per shader cell. */
  cellPx: number;
  /** 0 plasma · 1 ripple · 2 waves. */
  pattern: number;
  /** 0 fully visible … 1 fully dissolved. */
  dissolve: number;
  /** Exactly 4 palette colors, dark → bright. */
  colors: Rgb01[];
}

export interface PixelShaderRenderer {
  render(frame: PixelShaderFrame): void;
}

// One renderer per canvas, kept for the canvas's lifetime. A canvas hands
// back the SAME context on every getContext() call, so tearing the context
// down in an effect cleanup would poison the StrictMode/HMR remount — cache
// instead, exactly like dither.ts does for <Figure>.
const renderers = new WeakMap<HTMLCanvasElement, PixelShaderRenderer | null>();

export function getPixelShaderRenderer(canvas: HTMLCanvasElement): PixelShaderRenderer | null {
  if (renderers.has(canvas)) return renderers.get(canvas) ?? null;
  let renderer: PixelShaderRenderer | null = null;
  try {
    renderer = createPixelShaderRenderer(canvas);
  } catch {
    // unsupported WebGL, blocked contexts, etc. — degrade to transparent
  }
  renderers.set(canvas, renderer);
  return renderer;
}

function createPixelShaderRenderer(canvas: HTMLCanvasElement): PixelShaderRenderer | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
  if (!gl) return null;

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) return null;
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

  const u = {
    resolution: gl.getUniformLocation(program, "u_resolution"),
    cell: gl.getUniformLocation(program, "u_cell"),
    time: gl.getUniformLocation(program, "u_time"),
    pattern: gl.getUniformLocation(program, "u_pattern"),
    dissolve: gl.getUniformLocation(program, "u_dissolve"),
    colors: [
      gl.getUniformLocation(program, "u_c0"),
      gl.getUniformLocation(program, "u_c1"),
      gl.getUniformLocation(program, "u_c2"),
      gl.getUniformLocation(program, "u_c3"),
    ],
  };

  return {
    render({ time, cellPx, pattern, dissolve, colors }: PixelShaderFrame) {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (width <= 1 || height <= 1) return;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.useProgram(program);
      gl.viewport(0, 0, width, height);
      gl.uniform2f(u.resolution, width, height);
      gl.uniform1f(u.cell, Math.max(1, cellPx * dpr));
      gl.uniform1f(u.time, time);
      gl.uniform1f(u.pattern, pattern);
      gl.uniform1f(u.dissolve, Math.min(1, Math.max(0, dissolve)));
      for (let i = 0; i < 4; i++) gl.uniform3fv(u.colors[i], colors[i] ?? colors[colors.length - 1] ?? [0, 0, 0]);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}
