/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import parse from '../../parsers';
import {parse as js_parse} from '../../parsers/babylon_parser';
import {parse as ts_parse} from '../../parsers/typescript_parser';

jest.mock('../../parsers/babylon_parser', () => {
  const mock_js_parse = jest.fn();
  return {parse: mock_js_parse};
});
jest.mock('../../parsers/typescript_parser', () => {
  const mock_ts_parse = jest.fn();
  return {parse: mock_ts_parse};
});

describe('select parser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('for .js or .jsx file', () => {
    const files = ['abc.js', 'abc.jsx'];
    files.forEach(file => {
      parse(file, undefined, true);
      expect(js_parse).toHaveBeenCalled();
      expect(ts_parse).not.toHaveBeenCalled();
      jest.clearAllMocks();
    });
  });
  it('for .ts or .tsx file', () => {
    const files = ['abc.ts', 'abc.tsx'];
    files.forEach(file => {
      parse(file, undefined, true);
      expect(js_parse).not.toHaveBeenCalled();
      expect(ts_parse).toHaveBeenCalled();
      jest.clearAllMocks();
    });
  });
  describe('when unrecognized file type', () => {
    it('fall back to js parser in non-strict mode', () => {
      const files = ['abc', 'abc.ttsx'];
      files.forEach(file => {
        expect(() => parse(file, undefined, false)).not.toThrow();
        expect(js_parse).toHaveBeenCalled();
        expect(ts_parse).not.toHaveBeenCalled();
        jest.clearAllMocks();
      });
    });
    it('throw exception in strict mode', () => {
      const files = ['abc', 'abc.ttsx'];
      files.forEach(file => {
        expect(() => parse(file, undefined, true)).toThrow();
        jest.clearAllMocks();
      });
    });
  });
});
