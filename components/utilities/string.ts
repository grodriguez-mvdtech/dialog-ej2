function removeInvalidCharacters(string: string) {
  return string.replace(/[^a-z0-9-_:.]|^[^a-z]+/gi, "");
}

export { removeInvalidCharacters };
