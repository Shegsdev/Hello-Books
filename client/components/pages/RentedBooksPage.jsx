import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSpecificBook } from '../../actions/BookActions';
import { bindActionCreators } from 'redux';
import HeaderSideBar from '../includes/HeaderSideBar';
import RentedBooks from '../includes/RentedBooks';
import { getRentedBooksAction } from '../../actions/BookActions';

class RentedBooksPage extends Component {
    constructor(props) {
        super(props);
        this.renderRentedBooks = this
            .renderRentedBooks
            .bind(this);
    }

    componentDidMount(props) {
        this
            .props
            .actions
            .getRentedBooksAction(this.props.user.user.currentUser.userId);
    }
    renderRentedBooks() {
        let rentedBooks = this.props.rentedBooks.data;
        if (rentedBooks.length < 1) {
            return (
                <h1 className="empty-notifier">You have not rented any book
                </h1>
            )
        } else {
            return (
                <div className="admin-book-list">
                    <div className="card-panel teal user-book-header">
                        <center>My Rented Books</center>
                    </div>
                    <div className="row">
                        {rentedBooks.map((book) => {
                            return (<RentedBooks
                                description={book.description}
                                id={book.bookId}
                                userId={this.props.user.userId}
                                key={book.id}
                                title={book.title}
                                cover={book.cover}
                                userId={book.userId}/>)
                        })
}
                    </div>
                </div>

            )
        }
    }
    render() {
        return (
            <div>
                <HeaderSideBar/> {this.renderRentedBooks()}
            </div>
        )
    }
}

RentedBooks.PropTypes = {
    user: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    rentedBooks: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {rentedBooks: state.book, user: state.auth}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            getRentedBooksAction
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RentedBooksPage);
