export default function errorHandler<T>(errorOrObj: T): T {
  if (errorOrObj) {
    // rejection from `import()` for some reason is not and instance of Error
    // that's why the "Object.getPrototypeOf(errorOrObj).name"
    if (errorOrObj instanceof Error || Object.getPrototypeOf(errorOrObj).name === 'Error') {
      throw new Error(`useAlienModule ${errorOrObj}`);
    }
  }
  return errorOrObj;
}
