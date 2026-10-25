import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, Image, ScrollView, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';

function FullVideo({ uri, onExit }) {
  const player = useVideoPlayer(uri, p => { p.loop = false; p.play(); });
  return <View style={s.full}><VideoView player={player} style={s.media} contentFit="contain" nativeControls />
    <Pressable style={s.exit} onPress={onExit}><Text style={s.exitText}>✕ Fechar</Text></Pressable>
    <Text style={s.tip}>Para projeção real, use um acessório óptico com lente apropriada.</Text>
  </View>;
}

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [media, setMedia] = useState(null);

  useEffect(() => { if (!permission?.granted) setTorch(false); }, [permission]);

  async function pick(kind) {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: kind === 'video' ? ['videos'] : kind === 'photo' ? ['images'] : ['images','videos'],
      allowsEditing: false, quality: 1, videoMaxDuration: 600
    });
    if (!res.canceled && res.assets?.[0]) setMedia(res.assets[0]);
  }

  async function toggleTorch() {
    if (!permission?.granted) {
      const p = await requestPermission();
      if (!p.granted) { Alert.alert('Permissão necessária', 'Autorize a câmera para usar o flash.'); return; }
    }
    setTorch(v => !v);
  }

  if (media) {
    if (media.type === 'video') return <FullVideo uri={media.uri} onExit={() => setMedia(null)} />;
    return <View style={s.full}><StatusBar hidden /><Image source={{uri:media.uri}} style={s.media} resizeMode="contain" />
      <View style={s.overlayActions}>
        <Pressable style={s.pill} onPress={() => setMedia(null)}><Text style={s.pillText}>✕ Fechar</Text></Pressable>
        <Pressable style={s.pill} onPress={() => pick('all')}><Text style={s.pillText}>＋ Outra mídia</Text></Pressable>
      </View>
      <Text style={s.tip}>Imagem em tela cheia • A projeção exige lente óptica externa compatível.</Text>
    </View>;
  }

  return <View style={s.container}>
    <CameraView style={s.hiddenCamera} facing="back" enableTorch={torch} />
    <StatusBar barStyle="light-content" />
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.brand}><View style={s.logo}><Text style={{fontSize:30}}>🔦</Text></View>
        <Text style={s.title}>Lanterna<Text style={s.accent}> Projetor</Text></Text>
        <Text style={s.subtitle}>Tela cheia • Mídia • Flash</Text></View>
      <View style={s.card}>
        <Text style={s.section}>CONTROLE DA LANTERNA</Text>
        <Pressable style={[s.torchButton, torch && s.torchOn]} onPress={toggleTorch}>
          <Text style={s.torchIcon}>{torch ? '☀️' : '🔦'}</Text>
          <Text style={s.torchLabel}>{torch ? 'DESLIGAR FLASH' : 'LIGAR FLASH'}</Text>
        </Pressable>
        <Text style={s.helper}>O flash é apenas uma luz auxiliar. A imagem vem da tela e precisa de lente óptica para ser projetada.</Text>
      </View>
      <View style={s.card}>
        <Text style={s.section}>ESCOLHA O CONTEÚDO</Text>
        <Pressable style={s.action} onPress={() => pick('photo')}><Text style={s.actionIcon}>▧</Text><View style={{flex:1}}><Text style={s.actionTitle}>Selecionar foto</Text><Text style={s.actionSub}>Exibir uma imagem em tela cheia</Text></View><Text style={s.arrow}>›</Text></Pressable>
        <Pressable style={s.action} onPress={() => pick('video')}><Text style={s.actionIcon}>▶</Text><View style={{flex:1}}><Text style={s.actionTitle}>Selecionar vídeo</Text><Text style={s.actionSub}>Reproduzir vídeo com controles</Text></View><Text style={s.arrow}>›</Text></Pressable>
        <Pressable style={s.action} onPress={() => pick('all')}><Text style={s.actionIcon}>▣</Text><View style={{flex:1}}><Text style={s.actionTitle}>Abrir mídia</Text><Text style={s.actionSub}>Escolher foto ou vídeo</Text></View><Text style={s.arrow}>›</Text></Pressable>
      </View>
      <View style={s.card}>
        <Text style={s.section}>GUIA DE ALINHAMENTO</Text>
        {['Coloque o celular no suporte óptico compatível, com a tela voltada para a lente.','Centralize a imagem na lente e ajuste o foco pelo mecanismo do acessório.','Apague as luzes do ambiente e aproxime/afaste o conjunto da parede para ajustar o tamanho.','Não deixe o flash ligado por muito tempo se o aparelho aquecer.'].map((t,i)=><View style={s.step} key={i}><Text style={s.stepNum}>{i+1}</Text><Text style={s.stepText}>{t}</Text></View>)}
        <Text style={s.warning}>Importante: este app não consegue transformar o flash em projetor. A projeção depende de hardware óptico que projete a imagem da tela.</Text>
      </View>
      <Text style={s.footer}>Lanterna Projetor • versão 1.0</Text>
    </ScrollView>
  </View>;
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#090B13'}, hiddenCamera:{position:'absolute',width:1,height:1,opacity:0.01}, content:{padding:20,paddingTop:26,paddingBottom:36},
  brand:{alignItems:'center',marginBottom:24},logo:{width:76,height:76,borderRadius:24,backgroundColor:'#17182B',borderWidth:1,borderColor:'#4540A5',alignItems:'center',justifyContent:'center',marginBottom:12},
  title:{fontSize:27,fontWeight:'900',color:'#FFFFFF'},accent:{color:'#A78BFA'},subtitle:{color:'#8B91A7',marginTop:6,fontSize:13},
  card:{backgroundColor:'#121522',borderColor:'#24283B',borderWidth:1,borderRadius:20,padding:17,marginBottom:15},
  section:{fontSize:11,letterSpacing:1.7,color:'#9A9FB5',fontWeight:'800',marginBottom:15},
  torchButton:{backgroundColor:'#22263A',borderRadius:16,minHeight:112,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#3B3F58'},
  torchOn:{backgroundColor:'#28214A',borderColor:'#A78BFA'},torchIcon:{fontSize:32,marginBottom:7},torchLabel:{color:'#FFFFFF',fontWeight:'900',letterSpacing:1.2},
  helper:{color:'#A4A9BD',fontSize:12,lineHeight:18,marginTop:12},
  action:{flexDirection:'row',alignItems:'center',paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#25293A',gap:12},
  actionIcon:{color:'#B6A2FF',fontSize:24,width:30,textAlign:'center'},actionTitle:{color:'#FFFFFF',fontSize:15,fontWeight:'700'},actionSub:{color:'#8E94AA',fontSize:12,marginTop:4},arrow:{color:'#8F96B2',fontSize:26},
  step:{flexDirection:'row',gap:12,marginBottom:13,alignItems:'flex-start'},stepNum:{width:25,height:25,borderRadius:9,backgroundColor:'#292448',color:'#C4B5FD',textAlign:'center',textAlignVertical:'center',fontWeight:'800',overflow:'hidden'},stepText:{color:'#D0D3E0',fontSize:13,lineHeight:19,flex:1},
  warning:{backgroundColor:'#2B211A',color:'#FFD5A8',padding:12,borderRadius:12,fontSize:12,lineHeight:18,marginTop:4},footer:{textAlign:'center',color:'#545B72',fontSize:11,marginTop:6},
  full:{flex:1,backgroundColor:'#000',alignItems:'center',justifyContent:'center'},media:{width:'100%',height:'100%'},overlayActions:{position:'absolute',top:45,left:15,right:15,flexDirection:'row',justifyContent:'space-between'},pill:{backgroundColor:'#222222CC',paddingVertical:11,paddingHorizontal:15,borderRadius:22},pillText:{color:'#fff',fontWeight:'700'},exit:{position:'absolute',top:48,left:16,backgroundColor:'#222222CC',paddingVertical:10,paddingHorizontal:15,borderRadius:20},exitText:{color:'#fff',fontWeight:'700'},tip:{position:'absolute',bottom:16,left:18,right:18,textAlign:'center',color:'#D6D6D6',backgroundColor:'#111111BB',padding:9,borderRadius:10,fontSize:11}
});