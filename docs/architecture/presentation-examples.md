# Exemplos práticos para a palestra

## 1. Design system compartilhado
- O host e os MFEs usam os mesmos componentes base do package design-system.
- Isso mostra que a consistência visual não precisa ser sacrificada ao separar responsabilidades.

## 2. Comunicação por eventos
- O host publica mensagens com CustomEvent via window.dispatchEvent.
- Isso é útil para demonstrar um padrão simples de pub/sub para pequenas integrações.

## 3. Angular e React coexistindo
- O package notifications-mfe-angular mostra que um time com Angular pode coexistir no mesmo ecosistema de microfrontends.
- Esse exemplo é suficiente para discutir evolução gradual e coexistência tecnológica.

## 4. Cenários de falha
- Remote indisponível: o host mostra fallback.
- Cache e deploy quebrado: o projeto pode ser usado para discutir observabilidade e versionamento.
