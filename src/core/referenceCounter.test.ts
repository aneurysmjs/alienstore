/* eslint-disable @typescript-eslint/ban-ts-ignore */
import referenceCounter from './referenceCounter';

describe('reference counter', () => {
  interface ObjTest {
    id: string;
  }

  const objA = {
    prop: 1,
  };

  // const objB = {
  //   prop: 99,
  // };

  describe('reference counter methods', () => {
    const refCounter = referenceCounter();
    it('should have "has", "add", "remove" and "getCount" methods', () => {
      expect(refCounter).toHaveProperty('has');
      expect(refCounter).toHaveProperty('add');
      expect(refCounter).toHaveProperty('remove');
      expect(refCounter).toHaveProperty('getCount');
    });
  });

  describe('"has" method', () => {
    const promiseObjA = (): Promise<ObjTest> => Promise.resolve({ id: 'a' });
    const promiseObjB = (): Promise<ObjTest> => Promise.resolve({ id: 'b' });

    const arrayA = [promiseObjA, promiseObjB];
    const arrayB = [promiseObjB];

    it('should tell wheter or not a reference already extist', () => {
      const rm = referenceCounter();

      expect(rm.has(arrayA)).toBe(false);

      rm.add(arrayA);

      expect(rm.has(arrayA)).toBe(true);

      expect(rm.has(arrayB)).toBe(false);

      rm.add(arrayB);

      expect(rm.has(arrayB)).toBe(true);
    });
  });

  describe('"add" method', () => {
    it('should add a refence', () => {
      const rm = referenceCounter();
      rm.add(objA);
      rm.add(objA);
      rm.add(objA);
      rm.add(objA);
      const countObjA = rm.getCount(objA);
      expect(countObjA).toBe(4);
    });

    it.each([[1, 'a', 'Invalid value used as weak map key']])(
      'should throw when adding non-keyed objects',
      (input, expected) => {
        const rm = referenceCounter();
        // @ts-ignore
        expect(() => rm.add(input)).toThrowError(expected);
      },
    );
  });

  describe('"remove" method', () => {
    it('should remove a refence', () => {
      const rm = referenceCounter();
      rm.add(objA);
      rm.add(objA);
      rm.add(objA);
      rm.add(objA);

      rm.remove(objA);
      rm.remove(objA);
      rm.remove(objA);
      rm.remove(objA);
      const countObjA = rm.getCount(objA);
      expect(countObjA).toBe(0);
    });
  });
});