import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [id, setId] = useState(1);

  useEffect(() => {
    fetchPokemon();
  }, [id]);

  const fetchPokemon = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();

      const poke = {
        id: data.id,
        nome: data.name,
        imagem: data.sprites.front_default,
        tipo1: data.types[0]?.type.name,
        tipo2: data.types[1]?.type.name,
      };
      setPokemon(poke);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.areaLogo}>
        <Image source={require("./assets/logo.png")} />
      </View>

      <View style={styles.areaImagem}>
        <Image source={{ uri: pokemon?.imagem }} style={styles.imagemPoke} />
      </View>

      <View style={styles.areaDesc}>
        <View style={styles.areaNome}>
          <Text>Nome:</Text>
          <Text>{pokemon?.nome}</Text>
        </View>
        <View style={styles.areaTipo}>
          <Text>Tipo:</Text>
          <Text>{pokemon?.tipo1}</Text>
          {pokemon?.tipo2 && <Text>Tipo2: {pokemon.tipo2}</Text>}
        </View>
      </View>

      <View style={styles.areaBtn}>
        <TouchableOpacity style={styles.btn} onPress={() => setId(id - 1)}>
          <Text style={styles.txtBtn}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setId(id + 1)}>
          <Text style={styles.txtBtn}>Next</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  areaLogo: {
    flex: 1,
    margin: 50,
  },
  areaImagem: {
    flex: 1,
    margin: 10,
    backgroundColor: "",
  },
  areaDesc: {
    flex: 1,
  },
  areaNome: {
    flexDirection: "row",
  },
  areaTipo: {
    flexDirection: "row",
  },
  areaBtn: {
    flexDirection: "row",
    gap: 6,
  },
  btn: {
    backgroundColor: "#c25843",
    padding: 10,
    borderRadius: 8,
  },
  txtBtn: {
    backgroundColor: "#ffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagemPoke: {
    width: 120,
    height: 120,
  },
});
