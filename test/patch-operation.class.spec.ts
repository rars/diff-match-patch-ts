import { DiffOp } from '../src/diff-op.enum';
import { PatchOperation } from '../src/patch-operation.class';

describe('PatchOperation', () => {
  describe('toString()', () => {
    it('should return GNU diff format string', () => {
      const patchOperation = new PatchOperation();
      patchOperation.start1 = 128;
      patchOperation.start2 = 256;
      patchOperation.length1 = 2;
      patchOperation.length2 = 2;
      patchOperation.diffs = [[DiffOp.Insert, 'hello']];

      const stringValue = patchOperation.toString();

      expect(stringValue).toBe(
        '@@ -129,2 +257,2 @@\n' +
        '+hello\n');
    });
  });
});
