# Notas de runtime

## Fluxo atual
- O host está preparado para carregar os remotes Dashboard e Profile em runtime.
- O host usa hash routing simples para alternar entre as duas views.
- O carregamento é tratado com fallback e loading para fins didáticos.

## Pontos importantes
- O host depende da disponibilidade dos remotes nas portas 5001 e 5002.
- O design system é compartilhado entre host e remotes.
- O exemplo é intencionalmente simples para demonstrar o conceito sem adicionar complexidade desnecessária.
