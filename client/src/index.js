import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';
import './styles.css';

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    var basketTableJSON = getCookie(cname);
    if (basketTableJSON !== '') {
        return true;
    } else {
        return false;
    }
}


class BasketProducts extends Component {
        handleRemoveButtonClick(e, row) {
        e.stopPropagation();
        let spliceId;
        this.props.productsRowsInBasket.forEach(function (rowEl, index) {
            if (rowEl.ID === row.ID) {
                spliceId = index;
            }
        });

        this.props.handleRemoveButtonClick(spliceId);
    }

    render() {
        const tableHeader = this.props.productsRowsInBasket[0] ?
              <thead>
              <tr className='basketTableTr'>
                <th>ID</th>
                <th>ProductType</th>
                <th>CompanyProducer</th>
                <th>ProductPrice</th>
                <th></th>
              </tr>
              </thead>
              : false;


        return(
            <div>
                <i style={{float: 'left'}}>Basket products</i>
                <Link to='/' style={{float: 'right'}}>Close basket</Link>
                <table>
                  {tableHeader}
                <tbody>
                  {this.props.productsRowsInBasket.map(row =>
                                                <tr key={row.ID}>
                                                    <td>{row.ID}</td>
                                                    <td>{row.ProductType}</td>
                                                    <td>{row.CompanyProducer}</td>
                                                    <td>{row.ProductPrice}</td>
                                                  <td><button
                                                        onClick={(e) =>
                                                                 this.handleRemoveButtonClick(e, row)}
                                                        >
                                                          Remove from basket
                                                        </button></td>
                                                </tr>)}
                </tbody>
                </table>

                <div style={{
                    backgroundColor: 'black',
                    height: '5px'
                }}></div>
            </div>
        );
    }
};
const LinkToBasket = () => <Link to='/basketproducts' className='basketDivA'>Basket</Link>;

class FixedBasketDiv extends Component {
    constructor() {
        super();
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
    }

    handleRemoveButtonClick(spliceId) {
        this.props.handleRemoveButtonClick(spliceId);
    }

    render() {
        return(
            <Router>
              <div className='basketDiv'>
                <Route path='/basketproducts' render={() =>
                                                      <BasketProducts
                                                        productsRowsInBasket=
                                                          {this.props.productsRowsInBasket}
                                                        handleRemoveButtonClick=
                                                          {this.handleRemoveButtonClick}
                                                      />}
                />
                <Route path='/' exact component={LinkToBasket} />
              </div>
            </Router>
        );
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            productsRows: [],
            productsRowsInBasket: []
        };
        this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
        this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);
    }

    componentDidMount() {
        axios.get('/productsdata')
            .then(res => {
                this.setState({
                    productsRows: res.data
                });
            })
            .catch(err => {
                console.log(err);
            });


        let basketProducts = checkCookie('basketTableJSON') ?
            JSON.parse(getCookie('basketTableJSON')) :
            [];
        this.setState({
            productsRowsInBasket: basketProducts
        });
    }

    handleAddButtonClick(e, row) {
        e.stopPropagation();
        let newProductsRowsInBasket = this.state.productsRowsInBasket;
        newProductsRowsInBasket.push(row);
        this.setState({
            productsRowsInBasket: newProductsRowsInBasket
        });

        setCookie(
            'basketTableJSON',
            JSON.stringify(this.state.productsRowsInBasket),
            1
        );
    }

    handleRemoveButtonClick(spliceId) {
        let newProductsRowsInBasketAfterRemoving = this.state.productsRowsInBasket;
        newProductsRowsInBasketAfterRemoving.splice(spliceId, 1);
        this.setState({
            productsRowsInBasket: newProductsRowsInBasketAfterRemoving
        });

        setCookie(
            'basketTableJSON',
            JSON.stringify(this.state.productsRowsInBasket),
            1
        );
    }

    render() {
        let basketProducts = checkCookie('basketTableJSON') ?
            JSON.parse(getCookie('basketTableJSON')) :
            [];

        return (
            <div>
              <FixedBasketDiv productsRowsInBasket=
                                {basketProducts}
                              handleRemoveButtonClick=
                                {this.handleRemoveButtonClick}
              />

              <table className='mainTable'>
                <thead>
                  <tr className='mainTableTr'>
                    <th>ID</th>
                    <th>ProductType</th>
                    <th>CompanyProducer</th>
                    <th>ProductPrice</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.productsRows.map(row =>
                                             <tr key={row.ID}>
                                               <td>{row.ID}</td>
                                               <td>{row.ProductType}</td>
                                               <td>{row.CompanyProducer}</td>
                                               <td>{row.ProductPrice}</td>
                                               <td><button
                                                     onClick={(e) =>
                                                                    this.handleAddButtonClick(e, row)}
                                                   >
                                                     Add to basket
                                                   </button></td>
                                             </tr>
                                            )}
                </tbody>
              </table>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
