import isNil from '../utils/isNil';

interface ReferenceCounter {
  has<T extends object>(obj: T): boolean;
  getCount<T extends object>(obj: T): number;
  add<T extends object>(obj: T): void;
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
