import referenceCounter from './referenceCounter';

describe('reference counter', () => {
  describe('referenceCounter', () => {
    const refCounter = referenceCounter();
    it('should have "add", "remove" and "getCount" methods', () => {
      expect(refCounter).toHaveProperty('add');
      expect(refCounter).toHaveProperty('remove');
      expect(refCounter).toHaveProperty('getCount');
      expect(refCounter).toHaveProperty('has');
    });
  });

  interface ObjA {
    id: string;
  }

  const objA = {
    prop: 1,
  };

  const arrayA = [(): Promise<ObjA> => Promise.resolve({ id: 'a' })];

  it('should tell wheter or not a reference already extist', () => {
    const rm = referenceCounter();

    expect(rm.has(arrayA)).toBe(false);

    rm.add(arrayA);

    expect(rm.has(arrayA)).toBe(true);
  });

  it('should add a refence', () => {
    const rm = referenceCounter();
    rm.add(objA);
    rm.add(objA);
    rm.add(objA);
    rm.add(objA);
    const countObjA = rm.getCount(objA);
    expect(countObjA).toBe(4);
  });

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
