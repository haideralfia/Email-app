import './App.css';
import { Fragment, useRef, useEffect, useState } from 'react';
import { getDateString, truncate } from './utils';

export default function App() {
	const list_bottom_ref = useRef(null);
	const [reachedListBottom, setReachedListBottom] = useState(false);
	const [listLoading, setListLoading] = useState(true);
	const [emailList, setEmailList] = useState([]);
	const [listError, setListError] = useState(false);
	const [nextListLoading, setNextListLoading] = useState(true);
	const [nextListError, setNextListError] = useState(false);

	const [emailLoding, setEmailLoading] = useState(true);
	const [emailContent, setEmailContent] = useState('');
	const [emailError, setEmailError] = useState(false);
	const [selectedEmail, setSelectedEmail] = useState({});

	function onSelectEmail(email) {
		if (email?.id === selectedEmail?.id) {
			setSelectedEmail(false);
		} else {
			setSelectedEmail(email);
			fetchEmails(email?.id);
		}
	}

	const fetchEmails = async (email_id) => {
		try {
			const response = await fetch(
				`https://flipkart-email-mock.vercel.app/?id=${email_id}`
			);

			const data = await response.json();

			//console.log(data);
			setEmailContent(data);
			setEmailLoading(false);
			setEmailError(false);
		} catch (error) {
			console.log(error);
			setEmailLoading(false);
			setEmailError(true);
		}
	};

	// let text = {emailContent.body};

	useEffect(() => {
		const fetchEmailsList = async () => {
			try {
				const response = await fetch(
					'https://flipkart-email-mock.now.sh/?page=1'
				);

				const data = await response.json();
				// console.log(data);
				setEmailList(data?.list);
				setListLoading(false);
				setListError(false);
			} catch (error) {
				console.log(error);
				setListLoading(false);
				setListError(true);
			}
		};

		fetchEmailsList();
	}, []);

	///////////// The callback Function() in Intersection Observer API /////////////

	function callbackFn(entries) {
		const [entry] = entries;
		// entries?.forEach((entry) => {
		if (entry.isIntersecting) {
			fetchEmailsList('2'); // load next set
			setReachedListBottom(true); // reached bottom
		} else {
			setReachedListBottom(false);
		}
		// })
	}

	async function fetchEmailsList(page) {
		// fetching email list for next page
		console.log(emailList?.length, reachedListBottom);
		if (reachedListBottom && emailList?.length <= 10) {
			try {
				const response = await fetch(
					`https://flipkart-email-mock.now.sh/?page=${page}`
				);

				const data = await response.json();
				setEmailList([...emailList, ...data?.list]);
				console.log([...emailList, ...data?.list]);
				setNextListLoading(false);
				setNextListError(false);
			} catch (error) {
				console.log(error);
				setNextListLoading(false);
				setNextListError(true);
			}
		}
	}

	//////////////// To call Intersection Observer API ////////////////////

	useEffect(() => {
		let isMounted = true;

		///////////// Defining options{} of Intersection Observer API /////////////

		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 1,
		};

		let observer = new IntersectionObserver(callbackFn, options);
		if (isMounted) {
			if (list_bottom_ref.current) {
				observer.observe(list_bottom_ref.current);
			}
		}

		///// cleanup funciton() ////

		return () => {
			isMounted = false;
			if (list_bottom_ref.current) {
				observer.unobserve(list_bottom_ref.current);
			}
		};
	}, [list_bottom_ref, reachedListBottom, emailList]);

	//// ///////////// /// /// /////// //// /// /////// /////////// //////////////

	const onClickUnread = () => {};
	const onClickRead = () => {};
	const onClickFavourites = () => {};

	const markAsFavouriteBtn = () => {};

	const FILTERS = [
		{ name: 'Unread', key: 'unread', action: onClickUnread },
		{ name: 'Read', key: 'read', action: onClickRead },
		{ name: 'Favourites', key: 'favourites', action: onClickFavourites },
	];

	return (
		<div className="background_box no_scrollbar">
			<header className="filter_bar">
				<strong style={{ marginRight: '20px' }}>Filter By:</strong>

				{FILTERS?.map((filter) => (
					<strong
						key={filter?.key}
						onClick={filter?.action}
						className="each_filter selected_filter"
					>
						{filter?.name}
					</strong>
				))}
			</header>

			<main className="outermost_email_box">
				<div className="email_list_box no_scrollbar">
					{listLoading ? (
						<p className="loading_error">Loading...</p>
					) : listError ? (
						<p className="loading_error">An error occured !</p>
					) : (
						<Fragment>
							{emailList?.map((email) => (
								<section
									key={email?.id}
									onClick={() => onSelectEmail(email)}
									className={`email_list_each_email_box email_list_favourite_email ${
										selectedEmail?.id === email?.id
											? 'email_list_seleted_email'
											: ''
									}`}
								>
									<aside className="email_list_each_email_img">
										{email?.from?.name[0]?.toUpperCase()}
									</aside>
									<p className="email_list_each_email_details">
										<span>
											From:{' '}
											<strong>
												{email?.from?.name} &#60;
												{email?.from?.email}&#62;
											</strong>
										</span>
										<br />
										<span>
											Subject:{' '}
											<strong>{email?.subject}</strong>
										</span>
										<br />
										<span>
											{truncate(
												email?.short_description,
												45
											)}
										</span>
										<br />
										<span className="date_time_text">
											{getDateString(email?.date)}
											<strong className="email_list_favourite_tag">
												Favourite
											</strong>
										</span>
									</p>
								</section>
							))}
						</Fragment>
					)}

					{emailList && emailList?.length > 0 && (
						<div ref={list_bottom_ref}>
							{nextListLoading ? '' : nextListError ? '' : ''}
						</div>
					)}
				</div>

				{selectedEmail?.id && (
					<div className="opened_email_box no_scrollbar">
						<aside className="opened_email_img"></aside>
						{emailLoding ? (
							<p className="loading_error">Loading...</p>
						) : emailError ? (
							<p className="loading_error">An error occured !</p>
						) : (
							<Fragment>
								<div className="opened_email_details">
									<section className="opened_email_subject">
										<h2>{selectedEmail?.subject}</h2>
										<button
											onClick={markAsFavouriteBtn}
											key={emailContent.id}
											className="mark_as_favourite_btn"
										>
											Mark as Favourite
										</button>
									</section>
									<p className="date_time_text">
										{getDateString(selectedEmail?.date)}
									</p>
									<p className="opened_email_body">
										{emailContent?.body?.replaceAll(
											/<\/?[^>]+(>|$)/gi,
											''
										)}
									</p>
								</div>
							</Fragment>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
