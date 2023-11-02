import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import axios from "axios";

const NewsList = () => {
  const [articles, setArticles] = useState([]);

  const searchTerms = ["StreetFighter6", "streetfighter6"]; // Array of search terms

  const getArticles = async () => {
    const allArticles = [];

    for (const term of searchTerms) {
      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: term,
          sortBy: "publishedAt",
          language: "en",
          apiKey: "84f6b10ea8f740e6b4140c817a572603",
        },
      });

      const articles = response.data.articles;
      allArticles.push(...articles);
    }

    setArticles(allArticles);
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <View style={styles.container}>
      {articles.map((article, index) => {
        // Check if the article has a truthy urlToImage
        if (!article.urlToImage) {
          return null; // Skip rendering this article
        }

        return (
          <View style={styles.card} key={index}>
            <Image source={{ uri: article.urlToImage }} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.title}>{article.title}</Text>
              <Text style={styles.description}>{article.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#000000",
    elevation: 2,
    borderTopColor: "#4C51A2",
  },
  image: {
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#4C51A2",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#ffffff",
  },
  description: {
    fontSize: 14,
    color: "#ffffff",
  },
});

export default NewsList;
