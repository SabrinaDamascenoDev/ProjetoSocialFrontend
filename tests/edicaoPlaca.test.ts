import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dadosEdicaoPlaca, prepararEdicaoPlaca, validarEdicaoPlaca, validarFoto } from '../src/utils/edicaoPlaca.ts';

const placa = {
  id: 'placa-1', codigo: 'R-1', foto_url: 'https://example.test/original.png',
  endereco: 'Rua A - Centro', estado_conservacao: null, pelicula: null, substrato: null, suporte: null,
  data_registro: '2026-01-01', descricao_contran: null,
  cadastro: { endereco: { logradouro: 'Rua A', bairro: 'Centro', cep: '63900-000', referencia: null }, tipo_pelicula: 'TIPO_I', tipo_substrato: null, tipo_suporte: null, afastamento: 0 },
};

test('preserva endereço estruturado, zero e valores técnicos ao preencher', () => {
  const dados = dadosEdicaoPlaca(placa);
  assert.equal(dados.afastamento, '0');
  assert.equal(dados.tipo_pelicula, 'TIPO_I');
  assert.equal(dados.logradouro, 'Rua A');
  assert.equal(dados.tipo_substrato, '');
});

test('envia apenas alterações nos nomes aceitos pelo multipart; preserva foto original', () => {
  const dados = { ...dadosEdicaoPlaca(placa), logradouro: ' Rua Nova ', tipo_substrato: 'ACO' };
  assert.deepEqual([...prepararEdicaoPlaca(placa, dados, null)], [['logradouro', 'Rua Nova'], ['tipo_substrato', 'ACO']]);
});

test('inclui foto somente quando selecionada', () => {
  const foto = new File(['foto'], 'nova.png', { type: 'image/png' });
  const form = prepararEdicaoPlaca(placa, dadosEdicaoPlaca(placa), foto);
  assert.equal(form.get('foto'), foto);
  assert.equal([...form].length, 1);
});

test('não envia campos de endereço fora do Figma nem normaliza valores não editados', () => {
  const original = { ...placa, cadastro: { ...placa.cadastro, endereco: { ...placa.cadastro.endereco, logradouro: ' Rua A ' } } };
  const form = prepararEdicaoPlaca(original, dadosEdicaoPlaca(original), null);
  assert.deepEqual([...form], []);
  for (const campo of ['bairro', 'cep', 'referencia']) assert.equal(form.has(campo), false);
});

test('rejeita distâncias negativas/não finitas e enums inválidos', () => {
  for (const afastamento of ['-1', 'Infinity', 'abc']) {
    assert.ok(validarEdicaoPlaca(placa, { ...dadosEdicaoPlaca(placa), afastamento }).afastamento);
  }
  assert.ok(validarEdicaoPlaca(placa, { ...dadosEdicaoPlaca(placa), tipo_suporte: 'INVALIDO' }).tipo_suporte);
});

test('impede remoções que a API ignoraria silenciosamente', () => {
  const dados = { ...dadosEdicaoPlaca(placa), logradouro: '', tipo_pelicula: '', afastamento: '' };
  const errors = validarEdicaoPlaca(placa, dados);
  assert.ok(errors.logradouro && errors.tipo_pelicula && errors.afastamento);
  assert.throws(() => prepararEdicaoPlaca(placa, dados, null));
});

test('aceita JPEG/PNG/WEBP e rejeita arquivo vazio ou formato incompatível', () => {
  for (const type of ['image/jpeg', 'image/png', 'image/webp']) assert.equal(validarFoto(new File(['x'], 'foto', { type })), null);
  assert.ok(validarFoto(new File([], 'foto.png', { type: 'image/png' })));
  assert.ok(validarFoto(new File(['x'], 'foto.svg', { type: 'image/svg+xml' })));
});
