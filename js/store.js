
const { reactive } = Vue

const store = {
	debug: true,
	state: reactive({
		settings: {
			title: "",
			date: "",
			place: "",
			fontFamily: ""
		},

		books: [],
		wholeCart: 0,
	}),
	changeLike(isbn) {
		this.state.books.forEach(book => {
			if (book.isbn == isbn) {
				book.like = !book.like;
			}
		})
	},
	changeCart(isbn, calc) {
		this.state.books.forEach(book => {
			if (book.isbn == isbn) {
				if (calc === 'add') {
					book.cart++;
					this.state.wholeCart++;
				} else if (calc === 'remove') {
					if (book.cart > 0) {
						book.cart--;
						this.state.wholeCart--;
					} else {
						book.cart = 0;
						this.state.wholeCart = this.state.wholeCart;
					}
				}
			}
		})
	}
}