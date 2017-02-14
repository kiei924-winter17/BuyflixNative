// You need React
var React = require('react')

// You need React Native, too
var ReactNative = require('react-native')

// React Native components you want to use
var { AppRegistry, Image, ListView, StyleSheet, Text, TouchableHighlight, View } = ReactNative

// Firebase
var Firebase = require('firebase')
var firebase = Firebase.initializeApp({
  databaseURL: "https://buyflix-d7037.firebaseio.com/"
})
var database = firebase.database()
var moviesRef = database.ref('/movies')

var Movie = React.createClass({
  onMovieClicked: function() {
    this.props.onMovieClicked(this.props.movie)
  },
  render: function() {
    return (
      <View style={styles.movieContainer}>
        <TouchableHighlight style={styles.movie} onPress={this.onMovieClicked}>
          <Image source={{uri: this.props.movie.poster}}
                 style={styles.thumbnail} />
        </TouchableHighlight>
        <View style={styles.movie}>
          <Text style={styles.movieTitle}>{this.props.movie.title}</Text>
          <Text style={styles.movieText}>{this.props.movie.rating}</Text>
          <Text style={styles.movieText}>{this.props.movie.genre}</Text>
          <Text style={styles.movieText}>{this.props.movie.runtime}</Text>
        </View>
      </View>
    )
  }
})

var BuyflixNative = React.createClass({
  onMovieClicked: function(movie) {
    var moviesWithoutRemoved = this.state.movies.filter(function(existingMovie) {
      return existingMovie.id !== movie.id
    })
    this.setState({movies: moviesWithoutRemoved})
    moviesRef.set(moviesWithoutRemoved)
  },
  componentDidMount: function() {
    moviesRef.on('value', function(snapshot) {
      this.setState({ 
        movies: snapshot.val(),
        dataSource: this.state.dataSource.cloneWithRows(snapshot.val())
      })
    }.bind(this))
  },
  getInitialState: function() {
    return {
      movies: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  },
  renderMovie: function(movie) {
    return <Movie key={movie.key} movie={movie} onMovieClicked={this.onMovieClicked} />
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Buyflix</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderMovie}
          style={styles.listView}
        />
      </View>
    )
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818'
  },
  header: {
    paddingTop: 30,
    paddingBottom: 30
  },
  headerText: {
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'Roboto',
    color: '#fff'
  },
  listView: {
    paddingTop: 20
  },
  movieContainer: {
    padding: 0,
    flexDirection: 'row'
  },
  movie: {
    padding: 10
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  movieText: {
    color: '#fff'
  },
  thumbnail: {
    width: 80,
    height: 119
  }
})

AppRegistry.registerComponent('BuyflixNative', () => BuyflixNative)
