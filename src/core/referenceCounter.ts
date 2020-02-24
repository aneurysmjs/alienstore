import isNil from '../utils/isNil';

interface ReferenceCounter {
  /**
   * @desc Checks if the object exists
   * @param {T} obj
   * @returns boolean
   */
  has<T extends object>(obj: T): boolean;
  /**
   * @desc Retrieves obj's count for given T.
   * @param {T} obj
   * @returns boolean
   */
  getCount<T extends object>(obj: T): number;
  /**
   * @desc Adds an object reference and increments the counter.
   * @param {T} obj
   * @returns boolean
   */
  add<T extends object>(obj: T): void;
  /**
   * @desc Removes an object reference and decrements the counter.
   * @param {T} obj
   * @returns boolean
   */
  remove<T extends object>(obj: T): boolean;
}

export default function referenceCounter(): ReferenceCounter {
  const cache = new WeakMap();
  return {
    has(obj): boolean {
      return cache.has(obj);
    },

    getCount(obj): number {
      if (isNil(obj)) {
        return 0;
      }

      return cache.has(obj) ? cache.get(obj) : 0;
    },

    add(obj): void {
      if (isNil(obj)) {
        return;
      }
      const item = cache.has(obj);
      const count = 1;

      if (!item) {
        cache.set(obj, count);
      } else {
        let objCount = cache.get(obj);
        cache.set(obj, (objCount += 1));
      }
    },

    remove(obj): boolean {
      const item = cache.has(obj);

      if (!item) {
        return false;
      }

      let objCount = cache.get(obj);

      cache.set(obj, (objCount -= 1));

      if (objCount === 0) {
        cache.delete(obj);
        return true;
      }

      return false;
    },
  };
}
