

const snsComponent = {
	data() {
		return {
			show: false,
			items: [
				{
					text: "twitter",
					icon: "mdi-twitter"
				},
				{
					text: "instagram",
					icon: "mdi-instagram"
				},
				{
					text: "LINE",
					icon: "mdi-chat"
				},
				{
					text: "mail",
					icon: "mdi-email"
				}
			]
		}
	},
	template: `
		<v-menu>
			<template v-slot:activator="{ props }">
				<v-btn icon="mdi-menu-down" v-bind="props"></v-btn>
			</template>
			<v-list>
				<v-list-item
					v-for="(item, i) in items"
					:key="i"
					:value="item"
					active-color="primary"
				>
					<template v-slot:prepend>
						<v-icon :icon="item.icon"></v-icon>
					</template>
        	<v-list-item-title v-text="item.text"></v-list-item-title>
      	</v-list-item>
			</v-list>
    </v-menu>
	`
}


const searchComponent = {
	data() {
		return {
			drawer: false,
			loaded: false,
			loading: false,
			genres: ['法', '政治・経済', '文系その他', '英語', '第二言語', '数学', '理科', '情報・統計', '理系その他', '教職・資格']
		}
	},
	methods: {
		onClick() {
			this.loading = true

			setTimeout(() => {
				this.loading = false
				this.loaded = true
			}, 2000)
		},
	},
	template: `
		<v-card
			class="mx-auto"
			color="grey-lighten-3"
		>
			<v-card-text>
				<v-text-field
					:loading="loading"
					density="compact"
					variant="solo"
					label="キーワード"
					append-inner-icon="mdi-magnify"
					single-line
					hide-details
					@click:append-inner="onClick"
				></v-text-field>
			</v-card-text>
			<v-card-text>
				<v-select
					:items="['フリーワード', '教科書名', 'ISBN']"
					label="検索方法"
					density="comfortable"
				></v-select>
				<v-select
					clearable
					chips
					:items="genres"
					label="分野"
					density="comfortable"
					multiple
				></v-select>
			</v-card-text>
			</v-card>
	`
}

const headerComponent = {
	data() {
		return {
			drawer: false
		}
	},
	props: {
		title: String,
		date: String,
		place: String,
		fontFamily: String
	},
	emits: ['sns', 'menu'],
	methods: {
		emitState(arg) {
			this.$emit(arg);
		}
	},
	components: {
		'cv-sns': snsComponent,
		'cv-search': searchComponent
	},
	template: `
		<v-app-bar density="comfortable" height="72" color="light-green">
			<template v-slot:prepend>
				<v-btn icon="mdi-card-search" @click.stop="drawer = !drawer"></v-btn>
			</template>
			<v-app-bar-title style="text-align: center; margin:auto; font-weight: 500;" :style="fontFamily">{{ title }}<br>
				<p style="font-size: small;text-align: center;">{{ date }} | {{ place }}</p>
			</v-app-bar-title>
			<template v-slot:append>
				<cv-sns></cv-sns>
      		</template>
		</v-app-bar>
		<v-navigation-drawer
			v-model="drawer"
			location="start"
			temporary
		>
		<cv-search></cv-search>
		</v-navigation-drawer>
	`

}



const cartBtnComponent = {
	props: {
		cart: Number
	},
	template: `
		<div 
			style="position:fixed; z-index:1; bottom:24px; right:24px;"
		>
			<v-badge
				:content="cart>0 ? cart:''"
				:color="cart>0 ? 'cyan' : 'transparent'"
				text-color="white"
				offset-x="8"
				offset-y="8"
			>
				<v-btn
					icon="mdi-cart"
					color="#212121"
					size="x-large"
					style="color:white;"
				></v-btn>
			</v-badge>
		</div>
	`

}


const bookCard = {
	props: {
		isbn: Number,
		title: String,
		author: String,// only first author
		publisher: String,
		originalPrice: Number,
		sellingPrice: Number,
		genre: String,
		stock: Number,

		like: Boolean,
		cart: Number,
	},
	data() {
		return {
			showBtn: false,
			showDetail: false,
			imgSrc: `https://cover.openbd.jp/${this.isbn}.jpg`,
			price: [this.originalPrice, this.sellingPrice].map(price => {
				return (price || 0).toLocaleString('ja-JP',
					{
						style: 'currency',
						currency: 'JPY'
					}
				)
			}).join(" → "),

		}
	},
	emits: ['like', 'cart'],
	methods: {
		emitLike() {
			this.$emit('like', this.isbn);
			// console.log(this.isbn);
		},
		emitCart(calc) {
			this.$emit('cart', this.isbn, calc);
		}
	},
	template: `
		
			<v-card
				class="mx-auto"
				:color="like ? '#FFCDD2' : ''"
				:elevation="cart > 3 ? 11 :(cart>0 ? cart*3+2:2)"
			>
				<v-img
				:src="imgSrc"
				height="200px"
				cover
				>
					<div class="d-flex justify-end">
						<transition
							enter-active-class="animate__animated animate__backInRight"
							leave-active-class="animate__animated animate__backOutRight"
						>
						<div v-if="showBtn">
						<v-btn
							icon="mdi-heart"
							size="x-small"
							:class="like ? 'text-red' : ''"
							@click="emitLike"
							style="margin-top:8px; margin-right:8px;"
						></v-btn>
						<v-btn
							icon="mdi-cart-plus"
							size="x-small"
							@click="emitCart('add');"
							style="margin-top:8px; margin-right:8px;"
							value="add"
							></v-btn>
						<v-btn
							icon="mdi-cart-minus"
							size="x-small"
							@click="emitCart('remove');"
							style="margin-top:8px; margin-right:8px;"
							:disabled="cart<=0"
						></v-btn>
						</div>
						</transition>
						
						<v-btn
							:icon="showBtn? 'mdi-close' :'mdi-plus'"
							size="x-small"
							:color="showBtn? '#C0C0C0' :'white'"
							style="margin-top:8px; margin-right:8px;"
							@click="showBtn = !showBtn"
						></v-btn>
					</div>
				</v-img>

				
				<v-card-text class="text-h6 font-weight-medium">
				
					{{ title }}
					
				</v-card-text>
				<v-card-subtitle>{{ price }}</v-card-subtitle>
				

				<v-card-actions>
				<v-spacer></v-spacer>
					<v-btn
						:icon="showDetail ? 'mdi-chevron-up' : 'mdi-chevron-down'"
						size="x-small"
						@click="showDetail = !showDetail"
					></v-btn>
				<v-spacer></v-spacer>
				<v-badge
					:content="cart>0 ? cart:''"
					:color="cart>0 ? 'cyan' : 'transparent'"
					offset-x="12"
					text-color="white"
				></v-badge>
				</v-card-actions>

				<v-expand-transition>
					<div v-show="showDetail">
						<v-divider></v-divider>

						<v-card-text>
						ISBN:{{ isbn }}<br>
						著者:{{ author }}<br>
						出版社:{{ publisher }}<br>
						分野:{{ genre }}<br>
						残り在庫数:{{ stock }}
						</v-card-text>
					</div>
				</v-expand-transition>
			</v-card>
    `
}

const bookCardsComponent = {
	props: {
		books: Array,
		bookFlex: Number
	},
	components: {
		'cv-card': bookCard
	},
	emits: ['like', 'cart'],
	methods: {
		emitLikeRelay(isbn) {
			this.$emit('like', isbn);
			// console.log(isbn);
		},
		emitCartRelay(isbn, calc) {
			this.$emit('cart', isbn, calc);
			// console.log(isbn, calc);
		}
	},
	template: `
		<v-container fluid>
			<v-row dense>
				<v-col v-for="(book, index) in books" :cols="bookFlex">
					<transition-group name="flip-list" tag="div">
						<cv-card v-bind="book" :key="book.isbn" @like="emitLikeRelay" @cart="emitCartRelay">
						</cv-card>
					</transition-group>
				</v-col>
			</v-row>
		</v-container>
	`
}

const bookCardDialog = {
	props: {
		book: Object
	},
	data() {
		return {
			dialog: false
		}
	},
	components: {
		'cv-card': bookCard
	},
	emits: ['like', 'cart'],
	methods: {
		emitLikeRelay(isbn) {
			this.$emit('like', isbn);
			// console.log(this.book);
		},
		emitCartRelay(isbn, calc) {
			this.$emit('cart', isbn, calc);
			// console.log(isbn, calc);
		}
	},
	template: `
	<div class="text-center">
    <v-dialog
      v-model="dialog"
    >
      <template v-slot:activator="{ props }">
				<v-badge
					:content="book.cart>0 ? book.cart:''"
					:color="book.cart>0 ? 'cyan' : 'transparent'"
					text-color="white"
				>
					<v-btn
						:color="book.like? '#FFCDD2': 'grey-lighten-3'"
						v-bind="props"
						icon="mdi-card-text-outline"
						size="x-small"
					>
					</v-btn>
				</v-badge>
      </template>
				<cv-card v-bind="book" :key="book.isbn" @like="emitLikeRelay" @cart="emitCartRelay">  
				</cv-card>
		</v-dialog>
  </div>
	`
}

const bookTableComponent = {
	props: {
		books: Array
	},
	data() {
		return {
			prices: this.books.map(book => {
				const price = (book.sellingPrice || 0).toLocaleString('ja-JP',
						{
							style: 'currency',
							currency: 'JPY'
						}
					)
				return price;
			})
		}
	},
	components: {
		'cv-book-card-dialog': bookCardDialog
	},
	emits: ['like', 'cart'],
	methods: {
		emitLikeRelay(isbn) {
			this.$emit('like', isbn);
			// console.log(isbn);
		},
		emitCartRelay(isbn, calc) {
			this.$emit('cart', isbn, calc);
			// console.log(isbn, calc);
		}
	},
	template: `
	<div style="margin:auto;">
	<v-table
    fixed-header
    height="300px"
  >
    <thead>
      <tr>
        <th v-for="heading in ['', 'title', 'price', 'stock']" class="text-left">
					{{heading}}
        </th>				
      </tr>
    </thead>
    <tbody>
		
      <tr
        v-for="(book,index) in books"
        :key="book.isbn"
      >
				<td><cv-book-card-dialog :book="book" @like="emitLikeRelay" @cart="emitCartRelay"></cv-book-card-dialog></td>
        <td>{{ book.title }}</td>
				<td>{{ prices[index] }}</td>
				<td>{{ book.stock }}</td>
			</tr>
    </tbody>
  </v-table>
	
	</div>
	`
}


const cardsShowCaseComponent = {
	props:{
		books:Array
	},
	data() {
		return {
			showCase: "cv-book-card",
		}
	},
	components:{
		'cv-book-card': bookCardsComponent,
		'cv-book-table': bookTableComponent,
	},
	emits: ['like', 'cart'],
	methods: {
		emitLikeRelay(isbn) {
			this.$emit('like', isbn);
			// console.log(this.book);
		},
		emitCartRelay(isbn, calc) {
			this.$emit('cart', isbn, calc);
			// console.log(isbn, calc);
		}
	},
	template: `
		<v-container style="margin:auto">
			<v-row>
				<v-col>
					<v-select
						:items="['残り在庫数降順', '残り在庫数昇順', '教科書名昇順']"
						label="並び替え"
						density="comfortable"
						append-inner-icon="mdi-sort"
					></v-select>
				</v-col>
				<v-col>
					<v-btn
						icon="mdi-table"
						variant="text"
						flat
						:color="showCase === 'cv-book-table'? 'cyan':''"
						@click="showCase = 'cv-book-table'"
					></v-btn>
					<v-btn
						icon="mdi-card-text-outline"
						variant="text"
						flat
						:color="showCase === 'cv-book-card'? 'cyan':''"
						@click="showCase = 'cv-book-card'"
					></v-btn>
				</v-col>
			</v-row>
			<v-row>
				<transition
					name="component-fade"
					mode="out-in"
				>
				 <component :is="showCase" :books="books" @like="emitLikeRelay" @cart="emitCartRelay"></component>
				</transition>
			</v-row>
		</v-container>
	`
}

const reserveFormComponent = {
	props:{

	},
	data(){

	},
	template:`
	
	`
}