import { Slug } from './slug';

it('should be able to create a new slug from text', () => {
  const slug = Slug.createFromText('Exemplo De Questão');

  expect(slug.content).toEqual('exemplo-de-questao');
});