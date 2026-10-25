# Lanterna Projetor (Android)

Aplicativo Expo/React Native com:
- seleção de fotos e vídeos locais;
- visualização de fotos em tela cheia e reprodução de vídeos;
- controle do flash da câmera após permissão;
- guia de alinhamento para acessório óptico externo;
- workflow GitHub Actions para gerar APK de depuração.

## Gerar APK no GitHub
1. Abra a aba **Actions** do repositório.
2. Selecione **Build Android APK** e clique em **Run workflow** (ou faça push para main).
3. Quando terminar, abra a execução e baixe o artefato **Lanterna-Projetor-APK**.

## Executar localmente
Requer Node.js 20 e Android SDK:
```bash
npm install
npx expo prebuild --platform android
npx expo run:android
```

## Limitações importantes
O app não cria projeção óptica por software. O flash ilumina, mas não reproduz pixels da tela. Para projetar uma imagem real na parede, use hardware óptico especificamente projetado para receber a imagem de uma tela. Nem toda lente/acessório de celular consegue projetar a imagem de um smartphone. O flash é opcional e pode aquecer o aparelho; desligue-o se esquentar.