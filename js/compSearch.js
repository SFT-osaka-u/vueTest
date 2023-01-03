
const searchPage = {
	data() {
		return {
			settings: store.state.settings,
			books: store.state.books,
			wholeCart: 0,
		}
	},
	methods: {
		changeLike(isbn){
			store.changeLike(isbn);
		},
		changeCart(isbn, calc){
			store.changeCart(isbn, calc);
			if(calc === 'add'){
				this.wholeCart++;
			}else if(calc === 'remove'){
				this.wholeCart--;
			}
		}
	},
	components: {
		'cv-header': headerComponent,
		'cv-sns': snsComponent,
		'cv-cart-btn': cartBtnComponent,
		'cv-cards-show-case': cardsShowCaseComponent,
	},
	template: 
	`
		<div>
			<cv-header v-bind="settings"></cv-header>
			<v-main>
				<cv-cards-show-case :books="books" @like="changeLike" @cart="changeCart"></cv-cards-show-case>
				
					<cv-cart-btn :cart="wholeCart"></cv-cart-btn>
				
			</v-main>
		</div>
	`
	// `
	// 	<div>
	// 		<cv-header v-bind="settings"></cv-header>
	// 		<v-main>
	// 			<cv-cards-show-case :books="books" @like="changeLike" @cart="changeCart"></cv-cards-show-case>
	// 			<router-link to="/cart">
	// 				<cv-cart-btn :cart="wholeCart"></cv-cart-btn>
	// 			</router-link>
	// 		</v-main>
	// 	</div>
	// `
	,
}


export { searchPage as default };