import React from 'react'
import {withRouter, Redirect } from 'react-router-dom'

class NewForm extends React.Component {

    state = {
        name:'',
        category: '',
        image: '',
        description: '',
        brand: '',
        rating: '',
        link: '',
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    submitHandler = (e) => {
        e.preventDefault()
        let postObj = {
        name: this.state.name,
        category: this.state.category,
        image: this.state.image,
        description: this.state.description,
        brand: this.state.brand,
        rating: this.state.rating,
        link: this.state.link,
        user_id: this.props.user.id
        }
        this.props.fetchNewPost(postObj)
        this.props.history.push("/posts");
    }

    render(){
        return(
            <>
                {this.props.user ? 
                            <div class="newForm-container" >
                            <form id="contact" onSubmit={this.submitHandler}>
                                <h3 style={{display: 'flex', justifyContent: 'center'}}>Create a new Post</h3>
                                <fieldset>
                                <input placeholder="Post Name" name="name" type='text' value={this.state.name} onChange={this.changeHandler} />
                                </fieldset>
                                <fieldset>
                                <input placeholder="Post Categories" name='category' type='text' value={this.state.category} onChange={this.changeHandler}/>
                                </fieldset>
                                <fieldset>
                                <input placeholder="Post Image" name='image' type='text' value={this.state.image} onChange={this.changeHandler}/>
                                </fieldset>
                                <fieldset>
                                <input placeholder="Post Description" name='description' type='text' value={this.state.description} onChange={this.changeHandler}/>
                                </fieldset>
                                <fieldset>
                                <input placeholder="Brand" name='brand' type='text' value={this.state.brand} onChange={this.changeHandler}/>
                                </fieldset>
                                <fieldset>
                                <input placeholder="Your Rating" name='rating' type='text' value={this.state.rating} onChange={this.changeHandler}/>
                                </fieldset>
                                <fieldset>
                                <input placeholder="Item Link" name='link' type='text' value={this.state.link} onChange={this.changeHandler}/>
                                </fieldset>
                                <input type="submit" value="Create Post"/>
                            </form>
            
                        </div>
                :

                <Redirect to="/login" />
                
                
                }
            </> 
        )
    }
}

export default withRouter(NewForm)




