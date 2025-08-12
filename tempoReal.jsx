//importa hooks e funções do React
import { useState, useEffect, useRef } from "react";

//importa componentes View e Text
import { View, Text } from "react-native";

//importa estilos
import { styles } from "./style";

//importa o componente mapa e marcador
import MapView, { Marker } from "react-native-maps";

//importa funções de geolocalização
import {
  requestForegroundPermissionsAsync, //solicita permissão para acessar a localização
  getCurrentPositionAsync, //obtém a posição atual do dispositivo
  watchPositionAsync, //monitora a posição do dispositivo
  Accuracy, //define o nível de precisão da localização
} from "expo-location";

//componente de Tempo Real
export default function TempoReal() {
  //Estado para armazenar a localização do usuário
  const [location, setLocation] = useState(null);
  //Referência para o componente MapView
  const mapRef = useRef(null);

  //função para solicitar permissão de localização
  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync(); // solicita permissão de localização

    if (!granted) {
      console.log("Permissão de localização não concedida."); // mensagem de erro
      return; // encerra a função se não tiver permissão
    }

    const currentPosition = await getCurrentPositionAsync(); // obtém a posição atual
    setLocation(currentPosition); // define a localização no estado
    console.log("Localização atual:", currentPosition); //log apura a localização atual
  }

  //useEffect roda quando o componente é montado
  useEffect(() => {
    requestLocationPermission(); // solicita permissão de localização ao montar o componente
  }, []);

  //UseEffect para monitorar a localização do usuário
  useEffect(() => {
    const subscribe = async () => {
      await watchPositionAsync(
        {
          accuracy: Accuracy.Highest, //alta precisão
          timeInterval: 1000, //intervalo de tempo entre atualizações
          distanceInterval: 1, //distância mínima entre atualizações
        },
        (response) => {
          console.log("Nova localização:", response); //log da nova localização
          setLocation(response); //atualiza a localização no estado
          mapRef.current?.animateCamera({
            pitch: 70, //ângulo de visão
            center: response.coords, //centro do mapa na nova localização
          });
        }
      );
    };

    subscribe(); //chama a função subscribe para iniciar o monitoramento
  }, []);

  //Renderiza o componente
  return (
    <View style={styles.container}>
      {location ? ( //se a localização estiver disponível, renderiza o mapa
        <MapView
          ref={mapRef} //referência para o MapView
          style={styles.map} //aplica os estilos do mapa
          mapType="standard" //tipo de mapa
          showsBuildings={true} //mostra edifícios no mapa
          initialRegion={{ //região inicial do mapa  
            latitude: location?.coords?.latitude || -23.5505, //latitude inicial
            longitude: location?.coords?.longitude || -46.6333, //longitude inicial
            latitudeDelta: 0.005, //delta de latitude
            longitudeDelta: 0.005, //delta de longitude
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude, //latitude do marcador
              longitude: location.coords.longitude, //longitude do marcador
            }}
          />
        </MapView>
      ) : (
        <Text>Obtendo localização...</Text> //mensagem de carregamento
      )}
    </View>
  );
}
