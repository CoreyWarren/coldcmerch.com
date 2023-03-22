# Tip #1, Variable names: from reducer to webpage.

## When dispatching code in your containing page, use the same variable names that you declared in your reducer states!

example:

```js
// CODE SNIPPET FROM CART_ITEMS REDUCER:
const initialState = {
    cart_items_map: null,
    loading_cart_items: false,
  }

```

```js
// CODE SNIPPET FROM CARTPAGE.JS:
const { cart_items_map, loading_cart_items } = useSelector(state => state.cart_items);

```

### Explanation:

If you don't do this, your actions will not dispatch as intended. Thus, you will get errors such as:

```
Uncaught TypeError: Cannot read properties of undefined!
```

