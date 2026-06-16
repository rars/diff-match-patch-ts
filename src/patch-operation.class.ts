/**
 * PatchOperation has been derived from patch_obj in diff-match-patch by Neil Fraser
 * and the TypeScript of diffMatchPatch.ts in ng-diff-match-patch by Elliot Forbes.
 * See LICENSE.md for licensing details.
 *
 * Changes have been made to correct tslint errors and use the Diff and DiffOp types
 * by Richard Russell.
 *
 * ----------------------------------------------------------------------------------------
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DiffOp } from './diff-op.enum';
import { Diff } from './diff.type';

const OP_SYMBOLS: Record<DiffOp, string> = {
  [DiffOp.Insert]: '+',
  [DiffOp.Delete]: '-',
  [DiffOp.Equal]: ' ',
};

const formatCoords = (start: number, length: number): string => {
  if (length === 0) {
    return start + ',0';
  } else if (length === 1) {
    return `${start + 1}`;
  }

  return `${start + 1},${length}`;
};

/**
 * Class representing one patch operation.
 * @constructor
 */
export class PatchOperation {
  public diffs: Diff[] = [];
  public length1: number = 0;
  public length2: number = 0;

  public constructor(
    public start1: number,
    public start2: number,
  ) {}

  public clone(): PatchOperation {
    const patchCopy = new PatchOperation(this.start1, this.start2);

    patchCopy.diffs = this.diffs.map((diff) => [...diff] as Diff);

    patchCopy.length1 = this.length1;
    patchCopy.length2 = this.length2;

    return patchCopy;
  }

  /**
   * Emmulate GNU diff's format.
   * Header: @@ -382,8 +481,9 @@
   * Indicies are printed as 1-based, not 0-based.
   */
  public toString(): string {
    const coords1 = formatCoords(this.start1, this.length1);
    const coords2 = formatCoords(this.start2, this.length2);

    const text = [`@@ -${coords1} +${coords2} @@\n`];

    // Escape the body of the patch with %xx notation.
    for (const diff of this.diffs) {
      const op = OP_SYMBOLS[diff[0]];
      text.push(op + encodeURI(diff[1]) + '\n');
    }

    return text.join('').replace(/%20/g, ' ');
  }
}
