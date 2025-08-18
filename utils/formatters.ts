// Remove todos os caracteres que não são números
const unmask = (value: string) => value.replace(/\D/g, '');

export const formatCnpjCpf = (value: string | null | undefined): string => {
  if (!value) return '';
  const cleaned = unmask(value);

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return value; // Retorna o original se não corresponder
};

export const formatTelefone = (value: string | null | undefined): string => {
  if (!value) return '';
  const cleaned = unmask(value);

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return value;
};
