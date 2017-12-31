/**
 * These tests are derived by the tests in diff-match-patch by Neil Fraser.
 * See LICENSE.md for licensing details.
 *
 * They have been converted by Richard Russell to use the Jasmine framework for testing.
 *
 * -------------------------------------------------------------------------------------
 * Test Harness for Diff Match and Patch
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

import { DiffOp } from '../src/diff-op.enum';
import { Diff } from '../src/diff.type';
import { DiffMatchPatch } from '../src/diff-match-patch.class';

describe('DiffMatchPatch', () => {
  let dmp: DiffMatchPatch;

  beforeEach(() => {
    dmp = new DiffMatchPatch();
  });

  describe('diff_commonPrefix()', () => {
    it('should detect common prefix (null case)', () => {
      expect(dmp.diff_commonPrefix('abc', 'xyz')).toBe(0);
    });

    it('should detect common prefix (non-null case)', () => {
      expect(dmp.diff_commonPrefix('1234abcdef', '1234xyz')).toBe(4);
    });

    it('should detect common prefix (whole case)', () => {
      expect(dmp.diff_commonPrefix('1234', '1234xyz')).toBe(4);
    });
  });

  describe('diff_commonSuffix()', () => {
    it('should detect common suffix (null case)', () => {
      expect(dmp.diff_commonSuffix('abc', 'xyz')).toBe(0);
    });

    it('should detect common suffix (non-null case)', () => {
      expect(dmp.diff_commonSuffix('abcdef1234', 'xyz1234')).toBe(4);
    });

    it('should detect common suffix (whole case)', () => {
      expect(dmp.diff_commonSuffix('1234', 'xyz1234')).toBe(4);
    });
  });

  describe('diff_cleanupMerge()', () => {
    let diffs: Diff[];

    beforeEach(() => {
      diffs = undefined;
    });

    it('should cleanup a messy diff (null case)', () => {
      diffs = [];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([]);
    });

    it('should cleanup a messy diff (no change case)', () => {
      diffs = [[DiffOp.Equal, 'a'], [DiffOp.Delete, 'b'], [DiffOp.Insert, 'c']];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Equal, 'a'], [DiffOp.Delete, 'b'], [DiffOp.Insert, 'c']]);
    });

    it('should merge equalities in a messy diff', () => {
      diffs = [[DiffOp.Equal, 'a'], [DiffOp.Equal, 'b'], [DiffOp.Equal, 'c']];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Equal, 'abc']]);
    });

    it('should merge deletions in a messy diff', () => {
      diffs = [[DiffOp.Delete, 'a'], [DiffOp.Delete, 'b'], [DiffOp.Delete, 'c']];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Delete, 'abc']]);
    });

    it('should merge insertions in a messy diff', () => {
      diffs = [[DiffOp.Insert, 'a'], [DiffOp.Insert, 'b'], [DiffOp.Insert, 'c']];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Insert, 'abc']]);
    });

    it('should merge interweaving of insert and deletions', () => {
      diffs = [
        [DiffOp.Delete, 'a'],
        [DiffOp.Insert, 'b'],
        [DiffOp.Delete, 'c'],
        [DiffOp.Insert, 'd'],
        [DiffOp.Equal, 'e'],
        [DiffOp.Equal, 'f']
      ];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Delete, 'ac'], [DiffOp.Insert, 'bd'], [DiffOp.Equal, 'ef']]);
    });

    it('should adjust for common prefix/suffix strings', () => {
      diffs = [[DiffOp.Delete, 'a'], [DiffOp.Insert, 'abc'], [DiffOp.Delete, 'dc']];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Equal, 'a'], [DiffOp.Delete, 'd'], [DiffOp.Insert, 'b'], [DiffOp.Equal, 'c']]);
    });

    it('should adjust for common prefix/suffix strings with equalities', () => {
      diffs = [
        [DiffOp.Equal, 'x'],
        [DiffOp.Delete, 'a'],
        [DiffOp.Insert, 'abc'],
        [DiffOp.Delete, 'dc'],
        [DiffOp.Equal, 'y']
      ];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Equal, 'xa'], [DiffOp.Delete, 'd'], [DiffOp.Insert, 'b'], [DiffOp.Equal, 'cy']]);
    });

    it('should slide edits left', () => {
      diffs = [[DiffOp.Equal, 'a'], [DiffOp.Insert, 'ba'], [DiffOp.Equal, 'c']];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Insert, 'ab'], [DiffOp.Equal, 'ac']]);
    });

    it('should slide edits right', () => {
      diffs = [[DiffOp.Equal, 'c'], [DiffOp.Insert, 'ab'], [DiffOp.Equal, 'a']];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Equal, 'ca'], [DiffOp.Insert, 'ba']]);
    });

    it('should slide edits left recursively', () => {
      diffs = [
        [DiffOp.Equal, 'a'],
        [DiffOp.Delete, 'b'],
        [DiffOp.Equal, 'c'],
        [DiffOp.Delete, 'ac'],
        [DiffOp.Equal, 'x']
      ];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Delete, 'abc'], [DiffOp.Equal, 'acx']]);
    });

    it('should slide edits right recursively', () => {
      diffs = [
        [DiffOp.Equal, 'x'],
        [DiffOp.Delete, 'ca'],
        [DiffOp.Equal, 'c'],
        [DiffOp.Delete, 'b'],
        [DiffOp.Equal, 'a']
      ];
      dmp.diff_cleanupMerge(diffs);
      expect(diffs).toEqual([[DiffOp.Equal, 'xca'], [DiffOp.Delete, 'cba']]);
    });
  });

  describe('diff_text1()', () => {
    it('should compute source text', () => {
      const diffs: Diff[] = [
        [DiffOp.Equal, 'jump'],
        [DiffOp.Delete, 's'],
        [DiffOp.Insert, 'ed'],
        [DiffOp.Equal, ' over '],
        [DiffOp.Delete, 'the'],
        [DiffOp.Insert, 'a'],
        [DiffOp.Equal, ' lazy']
      ];
      expect(dmp.diff_text1(diffs)).toBe('jumps over the lazy');
    });
  });

  describe('diff_text2()', () => {
    it('should compute destination text', () => {
      const diffs: Diff[] = [
        [DiffOp.Equal, 'jump'],
        [DiffOp.Delete, 's'],
        [DiffOp.Insert, 'ed'],
        [DiffOp.Equal, ' over '],
        [DiffOp.Delete, 'the'],
        [DiffOp.Insert, 'a'],
        [DiffOp.Equal, ' lazy']
      ];
      expect(dmp.diff_text2(diffs)).toBe('jumped over a lazy');
    });
  });

  describe('diff_main()', () => {
    it('should perform a trivial empty diff', () => {
      expect(dmp.diff_main('', '', false)).toEqual([]);
    });

    it('should perform a trivial equality diff', () => {
      expect(dmp.diff_main('abc', 'abc', false)).toEqual([[DiffOp.Equal, 'abc']]);
    });

    it('should perform a trivial insertion diff', () => {
      expect(dmp.diff_main('abc', 'ab123c', false)).toEqual(
        [[DiffOp.Equal, 'ab'], [DiffOp.Insert, '123'], [DiffOp.Equal, 'c']]);
    });

    it('should perform a trivial deletion diff', () => {
      expect(dmp.diff_main('a123bc', 'abc', false)).toEqual(
        [[DiffOp.Equal, 'a'], [DiffOp.Delete, '123'], [DiffOp.Equal, 'bc']]);
    });

    it('should perform a double insertion diff', () => {
      expect(dmp.diff_main('abc', 'a123b456c', false)).toEqual(
        [
          [DiffOp.Equal, 'a'],
          [DiffOp.Insert, '123'],
          [DiffOp.Equal, 'b'],
          [DiffOp.Insert, '456'],
          [DiffOp.Equal, 'c']
        ]);
    });

    it('should perform a double deletion diff', () => {
      expect(dmp.diff_main('a123b456c', 'abc', false)).toEqual(
        [
          [DiffOp.Equal, 'a'],
          [DiffOp.Delete, '123'],
          [DiffOp.Equal, 'b'],
          [DiffOp.Delete, '456'],
          [DiffOp.Equal, 'c']
        ]);
    });

    it('should perform a simple diff', () => {
      dmp.Diff_Timeout = 0;
      expect(dmp.diff_main('a', 'b', false)).toEqual([[DiffOp.Delete, 'a'], [DiffOp.Insert, 'b']]);
    });

    it('should perform a sentence diff', () => {
      expect(dmp.diff_main('Apples are a fruit.', 'Bananas are also fruit.', false)).toEqual(
        [
          [DiffOp.Delete, 'Apple'],
          [DiffOp.Insert, 'Banana'],
          [DiffOp.Equal, 's are a'],
          [DiffOp.Insert, 'lso'],
          [DiffOp.Equal, ' fruit.']
        ]);
    });

    it('should perform a simple diff', () => {
      expect(dmp.diff_main('ax\t', '\u0680x\0', false)).toEqual(
        [
          [DiffOp.Delete, 'a'],
          [DiffOp.Insert, '\u0680'],
          [DiffOp.Equal, 'x'],
          [DiffOp.Delete, '\t'],
          [DiffOp.Insert, '\0']
        ]);
    });

    it('should perform diff with overlap', () => {
      expect(dmp.diff_main('1ayb2', 'abxab', false)).toEqual(
        [
          [DiffOp.Delete, '1'],
          [DiffOp.Equal, 'a'],
          [DiffOp.Delete, 'y'],
          [DiffOp.Equal, 'b'],
          [DiffOp.Delete, '2'],
          [DiffOp.Insert, 'xab']
        ]);
    });

    it('should perform a diff with a large insertion', () => {
      expect(dmp.diff_main('abcy', 'xaxcxabc', false)).toEqual(
        [
          [DiffOp.Insert, 'xaxcx'],
          [DiffOp.Equal, 'abc'],
          [DiffOp.Delete, 'y']
        ]);
    });

    it('should perform a diff with a large deletion', () => {
      expect(dmp.diff_main('ABCDa=bcd=efghijklmnopqrsEFGHIJKLMNOefg', 'a-bcd-efghijklmnopqrs', false)).toEqual(
        [
          [DiffOp.Delete, 'ABCD'],
          [DiffOp.Equal, 'a'],
          [DiffOp.Delete, '='],
          [DiffOp.Insert, '-'],
          [DiffOp.Equal, 'bcd'],
          [DiffOp.Delete, '='],
          [DiffOp.Insert, '-'],
          [DiffOp.Equal, 'efghijklmnopqrs'],
          [DiffOp.Delete, 'EFGHIJKLMNOefg']
        ]);
    });

    it('should perform a diff with a large equality', () => {
      expect(dmp.diff_main('a [[Pennsylvania]] and [[New', ' and [[Pennsylvania]]', false)).toEqual(
        [
          [DiffOp.Insert, ' '],
          [DiffOp.Equal, 'a'],
          [DiffOp.Insert, 'nd'],
          [DiffOp.Equal, ' [[Pennsylvania]]'],
          [DiffOp.Delete, ' and [[New']
        ]);
    });

    it('should apply timeout if configured', () => {
      // Timeout.
      dmp.Diff_Timeout = 0.1;  // 100ms

      let a = '`Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe:\n' +
        'All mimsy were the borogoves,\nAnd the mome raths outgrabe.\n';

      let b = 'I am the very model of a modern major general,\nI\'ve information vegetable, animal, and mineral,\n' +
        'I know the kings of England, and I quote the fights historical,\n' +
        'From Marathon to Waterloo, in order categorical.\n';

      // Increase the text lengths by 1024 times to ensure a timeout.
      for (let x = 0; x < 10; x++) {
        a = a + a;
        b = b + b;
      }

      const startTime = (new Date()).getTime();
      dmp.diff_main(a, b);
      const endTime = (new Date()).getTime();
      // Test that we took at least the timeout period.
      expect(endTime - startTime).toBeGreaterThan(dmp.Diff_Timeout * 1000);

      // Test that we didn't take forever (be forgiving).
      // Theoretically this test could fail very occasionally if the
      // OS task swaps or locks up for a second at the wrong moment.
      // ****
      // TODO(fraser): For unknown reasons this is taking 500 ms on Google's
      // internal test system.  Whereas browsers take 140 ms.
      // assertTrue(dmp.Diff_Timeout * 1000 * 2 > endTime - startTime);
      // ****
      dmp.Diff_Timeout = 0;
    });

    it('should use linemode speedup for simple line-mode', () => {
      // Must be long to pass the 100 char cutoff.
      const a = '1234567890\n1234567890\n1234567890\n1234567890\n1234567890\n1234567890\n1234567890\n' +
        '1234567890\n1234567890\n1234567890\n1234567890\n1234567890\n1234567890\n';
      const b = 'abcdefghij\nabcdefghij\nabcdefghij\nabcdefghij\nabcdefghij\nabcdefghij\nabcdefghij\n' +
        'abcdefghij\nabcdefghij\nabcdefghij\nabcdefghij\nabcdefghij\nabcdefghij\n';
      expect(dmp.diff_main(a, b, false)).toEqual(dmp.diff_main(a, b, true));
    });

    it('should use linemode speedup for single line-mode', () => {
      const a = '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345' +
        '678901234567890123456789012345678901234567890';
      const b = 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcde' +
        'fghijabcdefghijabcdefghijabcdefghijabcdefghij';
      expect(dmp.diff_main(a, b, false)).toEqual(dmp.diff_main(a, b, true));
    });

    it('should use linemode speedup for overlap line-mode', () => {
      function diff_rebuildtexts(diffs: Diff[]): [string, string] {
        // Construct the two texts which made up the diff originally.
        let text1 = '';
        let text2 = '';
        for (const diff of diffs) {
          if (diff[0] !== DiffOp.Insert) {
            text1 += diff[1];
          }
          if (diff[0] !== DiffOp.Delete) {
            text2 += diff[1];
          }
        }
        return [text1, text2];
      }

      // Overlap line-mode.
      const a = '1234567890\n1234567890\n1234567890\n1234567890\n1234567890\n1234567890\n1234567890\n' +
        '1234567890\n1234567890\n1234567890\n1234567890\n1234567890\n1234567890\n';
      const b = 'abcdefghij\n1234567890\n1234567890\n1234567890\nabcdefghij\n1234567890\n1234567890\n' +
        '1234567890\nabcdefghij\n1234567890\n1234567890\n1234567890\nabcdefghij\n';
      const texts_linemode = diff_rebuildtexts(dmp.diff_main(a, b, true));
      const texts_textmode = diff_rebuildtexts(dmp.diff_main(a, b, false));
      expect(texts_textmode).toEqual(texts_linemode);
    });

    it('should throw exception on null input', () => {
      expect(() => dmp.diff_main(null, null)).toThrow();
    });
  });
});
