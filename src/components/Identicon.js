import React, { PureComponent } from 'react';
import './Identicon.scss'

const getStyle = (diameter) => ({
    height: diameter,
    width: diameter,
    borderRadius: diameter/2,
});

export default class Identicon extends PureComponent {
    renderImage(){
        const { diameter, alt } = this.props;
        let { image } = this.props;

        if(Array.isArray(image) && image.length) {
            image = image[0];
        }

        return (
            <img className= "identicon__image-border"
              src = {image}
              style={getStyle(diameter)}
              alt={alt}
            />
        );
    }

    render() {
        const {
            address,
            image,
            diameter,
        } = this.props;
        const size = diameter+8;

        if(image){
            return this.renderImage();
        }

        return (
            <div
              className="identicon__image-border"
              style={getStyle(diameter)}
            ></div>
        );
    }
}