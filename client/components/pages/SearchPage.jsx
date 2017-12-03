import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import moment from 'moment';
import { rentBookAction } from '../../actions/BookActions';
import { searchAction } from '../../actions/BookActions';
import { bindActionCreators } from 'redux';
import Header from '../includes/Header';
import SideBar from '../includes/SideBar';
import AllBooks from '../includes/AllBooks';
import DashboardFooter from '../includes/DashboardFooter';

/**
 * SearchPage component
 * 
 * @class SearchPage
 * @extends {Component}
 */
class SearchPage extends Component {
	constructor(props) {
		super(props);
		this.renderBooks = this.renderBooks.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	/**
	 * Displays search result
	 * 
	 * 
	 * @memberOf SearchPage
	 */
	componentDidMount() {
		if (!location.search) {
			window.location = '/dashboard';
		}
		const page = location.search.split('=')[1];
		const result = page.split('&')[0];
		this.props.actions.searchAction({ search: result });
	}

	/**
	 * Handles renting of books
	 * 
	 * @param {any} id 
	 * 
	 * @memberOf SearchPage
	 */
	handleClick(id) {
		const cur = new Date(),
			after30days = cur.setDate(cur.getDate() + 20),
			finalDate = new Date(after30days);
		const newTime = moment(finalDate)
		.format('MMMM Do YYYY, h:mm a');
		swal({
			title: 'Are you sure?',
			text: `You will be mandated to return this 
			book on or before ${newTime}`,
			icon: 'warning',
			buttons: true,
			dangerMode: true
		}).then((willBorrow) => {
			if (willBorrow) {
				const userId = this.props.user.id || this.props.user.userId				
				rentBookAction(userId, 
					{ bookId: id })
			}
		});
	}

	/**
	 * Displays books that matches search query
	 * 
	 * @returns 
	 * 
	 * @memberOf SearchPage
	 */
	renderBooks() {
		const allbooks = this.props.search;
		if (!allbooks || allbooks.length < 1) {
			return (
				<div>
					<SideBar />
					<div className="empty-notifier">
						<h4>Your query did not match any book in our database</h4>
					</div>
				</div>
			);
		}
		return (
			<div className="row">
				<SideBar fullname={this.props.user.fullname} 
				isAdmin={this.props.user.isAdmin} />
				<div className="row">
					<div className="col s12 push-l3 m9">
						{allbooks.map((book) => {
							return (
								<AllBooks
									prodYear={book.prodYear}
									total={book.total}
									isbn={book.isbn}
									author={book.author}
									description={book.description}
									id={book.id}
									handleAction={this.handleClick}
									key={book.id}
									cover={book.cover}
									text='Borrow'
									title={book.title}
									description={book.description}
								/>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Displays the component
	 * 
	 * @returns 
	 * 
	 * @memberOf SearchPage
	 */
	render() {
		return (
			<div>
				<Header /> {this.renderBooks()}
				<DashboardFooter />
			</div>
		);
	}
}

SearchPage.PropTypes = {
	user: PropTypes.object.isRequired,
	actions: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return { 
		user: state.auth.user.currentUser, 
		search: state.book.data };
}

/**
 * @description mapStateToProps - maps state value to props
 *
 * @param  {object} state the store state
 *
 * @return {Object} returns state object
 */
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(
			{
				searchAction
			},
			dispatch
		)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
