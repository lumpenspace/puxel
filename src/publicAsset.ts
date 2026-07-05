export function publicAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function spriteAsset(sheet: string) {
  return publicAsset(`sprites/${sheet}.png`);
}
