

import { soma } from '../utils/math';

describe('Função soma', () => {
  it('soma corretamente', () => {
    expect(soma(2, 3)).toBe(5);
  });
});
