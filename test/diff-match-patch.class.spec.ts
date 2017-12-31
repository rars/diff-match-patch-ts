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
});
