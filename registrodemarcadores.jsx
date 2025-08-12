import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";

import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy,
  reverseGeocodeAsync,
} from "expo-location";

import { styles } from "./style";

// Lista de cores para os marcadores
const coresMarcadores = ["red", "blue", "green", "purple", "orange", "pink"];

// Componente principal
export default function RegistroDeMarcadores() {
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [marcadores, setMarcadores] = useState([]);
  const [enderecoAtual, setEnderecoAtual] = useState("");
  const referenciaMapa = useRef(null);

  // Solicita permissão de localização
  async function solicitarPermissaoLocalizacao() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const posicao = await getCurrentPositionAsync();
      setLocalizacaoAtual(posicao);

      const endereco = await reverseGeocodeAsync({
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      });
      if (endereco[0]) {
        setEnderecoAtual(`${endereco[0].street}, ${endereco[0].city}`);
      }

      console.log("Localização atual:", posicao);
    }
  }

  // Executa ao montar
  useEffect(() => {
    solicitarPermissaoLocalizacao();
  }, []);

  // Observa movimentação do usuário
  useEffect(() => {
    const iniciarObservacao = async () => {
      await watchPositionAsync(
        {
          accuracy: LocationAccuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        async (resposta) => {
          setLocalizacaoAtual(resposta);

          const endereco = await reverseGeocodeAsync({
            latitude: resposta.coords.latitude,
            longitude: resposta.coords.longitude,
          });
          if (endereco[0]) {
            setEnderecoAtual(`${endereco[0].street}, ${endereco[0].city}`);
          }

          referenciaMapa.current?.animateCamera({
            pitch: 70,
            center: resposta.coords,
          });
        }
      );
    };
    iniciarObservacao();
  }, []);

  // Adiciona novo marcador
  const adicionarMarcador = async () => {
    if (localizacaoAtual) {
      const { latitude, longitude } = localizacaoAtual.coords;
      const endereco = await reverseGeocodeAsync({ latitude, longitude });

      const textoEndereco = endereco[0]
        ? `${endereco[0].street}, ${endereco[0].city}`
        : "Endereço não encontrado";

      const novoMarcador = {
        id: marcadores.length + 1,
        latitude,
        longitude,
        endereco: textoEndereco,
        cor: coresMarcadores[marcadores.length % coresMarcadores.length],
      };

      setMarcadores([...marcadores, novoMarcador]);
      console.log(
        `📌 Posição ${novoMarcador.id}: ${latitude}, ${longitude} - ${textoEndereco}`
      );
    }
  };

  // Renderização
  return (
    <View style={styles.container}>
      {localizacaoAtual && (
        <>
          {/* Painel com dados da localização */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              📍 Latitude: {localizacaoAtual.coords.latitude.toFixed(6)}
            </Text>
            <Text style={styles.infoText}>
              📍 Longitude: {localizacaoAtual.coords.longitude.toFixed(6)}
            </Text>
            <Text style={styles.infoText}>🏠 {enderecoAtual}</Text>
          </View>

          <MapView
            ref={referenciaMapa}
            style={styles.map}
            mapType="standard"
            showsBuildings={true}
            initialRegion={{
              latitude: localizacaoAtual.coords.latitude,
              longitude: localizacaoAtual.coords.longitude,
              latitudeDelta: 0.0025,
              longitudeDelta: 0.0025,
            }}
            camera={{
              center: {
                latitude: localizacaoAtual.coords.latitude,
                longitude: localizacaoAtual.coords.longitude,
              },
              pitch: 70,
              heading: 0,
              altitude: 1000,
              zoom: 19,
            }}
          >
            {/* Marcador da posição atual com ícone personalizado */}
            <Marker
              coordinate={{
                latitude: localizacaoAtual.coords.latitude,
                longitude: localizacaoAtual.coords.longitude,
              }}
            >
              <Image
                source={require("./assets/homenzinho.png")}
                style={styles.markerMan}
                resizeMode="contain"
              />
            </Marker>

            {/* Marcadores adicionados manualmente */}
            {marcadores.map((marcador) => (
              <Marker
                key={marcador.id}
                coordinate={{
                  latitude: marcador.latitude,
                  longitude: marcador.longitude,
                }}
                title={`Posição ${marcador.id}`}
                description={marcador.endereco}
                pinColor={marcador.cor}
              />
            ))}
          </MapView>

          {/* Botão para adicionar marcador*/}
          <TouchableOpacity style={styles.botao} onPress={adicionarMarcador}>
            <Text style={styles.textoBotao}>Adicionar Marcador</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}