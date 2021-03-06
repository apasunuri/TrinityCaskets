import React, { Component} from 'react';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import axios from 'axios'

class ListingCreator extends Component{

    constructor(props) {
        super(props);

        // Setting up functions
        this.modelNumberChanged = this.modelNumberChanged.bind(this);
        this.descriptionChanged = this.descriptionChanged.bind(this);
        this.priceChanged = this.priceChanged.bind(this);
        this.imageChanged = this.imageChanged.bind(this);
        this.typeChanged = this.typeChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        // Setting up state
        this.state = {
            modelNumber: '',
            description: '',
            price: '',
            image: null,
            type: 'Casket',
            canLeave: false
        }
    }

    modelNumberChanged(e) {
        this.setState({ modelNumber: e.target.value })
    }

    descriptionChanged(e) {
        this.setState({ description: e.target.value })
    }

    priceChanged(e) {
        this.setState({ price: e.target.value })
    }

    imageChanged(e) {
        this.setState({ image: e.target.files[0] })
    }

    typeChanged(e) {
        this.setState({ type: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault();
        const data = new FormData();
        if(this.state.image) {
            data.append('image', this.state.image, this.state.image.name);
            var modelNumber = this.state.modelNumber;
            var description = this.state.description;
            var price = this.state.price;
            var type = this.state.type;
            axios.post('/api/images/', data).then(function(res) {
                if(res.status === 200) {
                    if(res.data.error) {
                        if(res.data.error.code === 'LIMIT_FILE_SIZE') {
                            console.log('Max Size is 2 MB');
                        }
                        else {
                            console.log(res.data.error);
                        }
                    }
                    else {
                        var location = res.data.location;
                        console.log('File Uploaded');
                        const newListing = {
                            modelNumber: modelNumber,
                            description: description,
                            image: location,
                            price: price,
                            type: type
                        };
                        axios.post('/api/listings', newListing)
                             .then(res => console.log(res.data));
                    }
                }
            })
        }
        else {
            console.log('Please Upload File');
        }

        this.setState({
            modelNumber: '',
            description: '',
            price: '',
            image: '',
            type: 'Casket',
            canLeave: true
        });
    }

    render() {
        if (this.state.canLeave){
            return(
                <div>
                    <center><h1>Listing Added Successfully!</h1></center>
                    <center><a href="/Admin">
                        <div className = "nav_button">
                            Click to return to listings
                        </div>
                    </a></center>
                </div>)
        }
        return (
            <div className="form-wrapper">
                <center><h1>New Listing</h1></center>
                <Form onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label for='modelNumber'>Model Number</Label>
                        <Input
                            type='modelNumber'
                            name='modelNumber'
                            id='modelNumber'
                            placeholder='Model Number'
                            className='mb-3'
                            onChange={this.modelNumberChanged}
                        />

                        <Label for='description'>Description</Label>
                        <Input
                            type='description'
                            name='description'
                            id='description'
                            placeholder='Description'
                            className='mb-3'
                            onChange={this.descriptionChanged}
                        />

                        <Label for='price'>Price</Label>
                        <Input
                            type='price'
                            name='price'
                            id='price'
                            placeholder='$$$'
                            className='mb-3'
                            onChange={this.priceChanged}
                        />

                        <Label for='image'>Image</Label>
                        <Input
                            type='file'
                            name='image'
                            id='image'
                            className='mb-3'
                            onChange={this.imageChanged}
                        />

                        <Label for='type'>Type</Label>
                        <Input
                            type='select'
                            name='type'
                            id='type'
                            placeholder='Type'
                            className='mb-3'
                            onChange={this.typeChanged}>
                            <option>Casket</option>
                            <option>Urn</option>
                            <option>Headstone</option>
                        </Input>

                        <Button color='dark' style={{ marginTop: '2rem' }} block>
                            Create listing
                        </Button>
                    </FormGroup>
                </Form>
            </div>);

    }
}

export default ListingCreator;