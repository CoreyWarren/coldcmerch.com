import Dropdown from 'react-bootstrap/Dropdown';

function ProductSizeDropdownMenu(sizeListMap, requested_product_id) {

    // sort the sizes according to the product we need here
    const relevant_product_sizes = [];

    for (let i = 0; i < sizeListMap.length; i+= 1){
        if(sizeListMap[i].product_id === requested_product_id){
            relevant_product_sizes.push(sizeListMap[i]);
        }
    }

    // push the size data into HTML elements
    const htmlSizeList = [];

    for (let i = 0; i < relevant_product_sizes.length; i += 1){
        const my_href = "#/action-" + [i];
        htmlSizeList.push(
            <Dropdown.Item href={my_href}>{relevant_product_sizes[i].size}</Dropdown.Item>
            );
    };

    // return all HTML elements as an object (which can be iterated thru)
    return htmlSizeList;

    /*
    return (
        <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
            Sizes
        </Dropdown.Toggle>
        <Dropdown.Menu>
            {htmlSizeList}
        </Dropdown.Menu>
        </Dropdown>
    );
    */
}

export default ProductSizeDropdownMenu;