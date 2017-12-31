import { DiffOp } from './diff-op.enum';
import { Diff } from './diff.type';

/**
 * Class representing one patch operation.
 * @constructor
 */
export class PatchOperation {

  constructor() {  }

  diffs: Array<Diff> = [];
  start1: number = null;
  start2: number = null;
  length1: number = 0;
  length2: number = 0;

  /**
   * Emmulate GNU diff's format.
   * Header: @@ -382,8 +481,9 @@
   * Indicies are printed as 1-based, not 0-based.
   */
  public toString(): string {
    let coords1, coords2;
    if (this.length1 === 0) {
      coords1 = this.start1 + ',0';
    } else if (this.length1 === 1) {
      coords1 = this.start1 + 1;
    } else {
      coords1 = (this.start1 + 1) + ',' + this.length1;
    }
    if (this.length2 === 0) {
      coords2 = this.start2 + ',0';
    } else if (this.length2 === 1) {
      coords2 = this.start2 + 1;
    } else {
      coords2 = (this.start2 + 1) + ',' + this.length2;
    }
    const text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
    let op;
    // Escape the body of the patch with %xx notation.
    for (let x = 0; x < this.diffs.length; x++) {
      switch (this.diffs[x][0]) {
        case DiffOp.Insert:
          op = '+';
          break;
        case DiffOp.Delete:
          op = '-';
          break;
        case DiffOp.Equal:
          op = ' ';
          break;
      }
      text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
    }
    return text.join('').replace(/%20/g, ' ');
  }
}
