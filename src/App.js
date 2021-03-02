import React from 'react';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import './App.css';
import PostContainer from './Containers/PostContainer';
import UserContainer from './Containers/UserContainer';
import NewForm from './Components/NewForm'
import Navbar from './Components/Navbar'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import { Redirect } from 'react-router'

const API = "https://malay-backend.herokuapp.com/posts"


class App extends React.Component {

  state = {
    postArray: [],
    searchValue: "",
    user: null, 
    users: [],
    favoritePosts: [],
    favorites: []
  }

  fetchPosts = () => {
    fetch(API)
    .then(response => response.json())
    .then(postData => {
      this.setState({ postArray: postData })
    })
  }

  componentDidMount(){
    console.log(this.state.user)
    this.fetchUsers()
    this.fetchPosts()
    this.fetchFavorites()
    const token = localStorage.getItem("token")
  if (token) {
    console.log(token)
    fetch('https://malay-backend.herokuapp.com/profile', {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`},
    })
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
      this.setUser(data.user)
      let setFavoritePosts = []
      if(this.state.user !== undefined){
        this.state.user.posts.forEach(favorite => setFavoritePosts.push(favorite))
        this.setState({favoritePosts: setFavoritePosts})        
      }
    })
  } 
  }

  commentUpdater = (id, content) => {

    let newComment = {
      content: content,
      post_id: id,
      user_id: this.state.user.id
    }
    fetch('https://malay-backend.herokuapp.com/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newComment)
    })
    .then(response => response.json())
    .then(response => {
      this.fetchPosts()
      console.log(response)
    })
  }

  fetchNewPost=(obj)=>{
    console.log(obj)
    fetch('https://malay-backend.herokuapp.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(newPostData => 
      {
        console.log(newPostData)
        this.setState({ postArray: [...this.state.postArray,newPostData] })
      })
  }

  changeHandler = (e) => {
    this.setState({ searchValue: e.target.value })
  }

  filteredArray = () => {
    return this.state.postArray.filter(post => post.category.toLowerCase().includes(this.state.searchValue.toLowerCase()))
  }


  // User Post Login 

  fetchNewUser = (userObj) => {
    console.log(userObj)
    fetch('https://malay-backend.herokuapp.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  body: JSON.stringify({ user:userObj })
})
  .then(response => response.json())
  .then(data => {
    console.log(data)
    this.setState({ user:data.user })
    this.fetchPosts()
  })
  }

  fetchUsers = () => {
    fetch('https://malay-backend.herokuapp.com/users')
    .then(response => response.json())
    .then(response => {
      this.setState({users: response})
    })
  }

  fetchFavorites = () => {
    fetch('https://malay-backend.herokuapp.com/favorites')
    .then(response => response.json())
    .then(response => {
      this.setState({favorites: response})
    })
  }
  

  signUpHandler = (userObj) => {
    this.fetchNewUser(userObj)
  }

  setUser = (user) => {
    this.setState({ user:user })
  }

  favHandler = (post) => {
    let newFavoritePosts = [...this.state.favoritePosts, post]
    this.setState({favoritePosts: newFavoritePosts})

    let favObj = {
      post_id: post.id,
      user_id: this.state.user.id
    }
    fetch('https://malay-backend.herokuapp.com/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
        },
        body: JSON.stringify({ favorite: favObj })
      })
        .then(response => response.json())
        .then(response => {
          this.fetchFavorites()
          console.log(response)
        })
    
  }

  deleteFavorite = (post) => {
    console.log(post)
   let newFavoritePosts = this.state.favoritePosts.filter(favoritePost => favoritePost.id !== post.id)
   this.setState({favoritePosts: newFavoritePosts})
   let favObj = this.state.favorites.find(favorite => favorite.post_id === post.id)
   console.log(favObj, this.state.favArray)
    fetch(`https://malay-backend.herokuapp.com/favorites/${favObj.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          console.log('Removed from favoites')
          console.log(this.state.favArray)
        })
  }

  clearFavoriteStateOnLogOut = () => {
    this.setState({favoritePosts: []})
  }


  render(){
    return (
      <>
          <BrowserRouter>
            <Navbar user={this.state.user} searchValue={this.state.searchValue} changeHandler={this.changeHandler} setUser={this.setUser} clearFavoriteStateOnLogOut={this.clearFavoriteStateOnLogOut}/>
            <Switch>
            <Route
                exact
                path="/"
                render={() => {
                    return (               
                      <Redirect to="/posts" /> 
                    )
                }}
              />
              <Route path="/login" render={(RouterProps) => <Login {...RouterProps} setUser={this.setUser}  users={this.state.users} user={this.state.user} fetchPosts={this.fetchPosts} />} />
              <Route path="/signup" render={(RouterProps) => <SignUp {...RouterProps} submitHandler={this.signUpHandler} setUser={this.setUser} user={this.state.user} />} />
              <Route path="/newform" render={() => <NewForm user={this.state.user} fetchNewPost={this.fetchNewPost} />} />
              <Route path="/posts" render={() => <PostContainer favHandler={this.favHandler} user={this.state.user} deleteFavorite={this.deleteFavorite} filteredArray={this.filteredArray()} favoritePosts={this.state.favoritePosts} commentUpdater={this.commentUpdater}/>} />
              <Route path="/users" render={() => <UserContainer user={this.state.user} fetchUsers={this.fetchUsers} favoritePosts={this.state.favoritePosts} users={this.state.users}/>} />
            </Switch>
          </BrowserRouter>
      </>
    )
  }
}


export default App;

