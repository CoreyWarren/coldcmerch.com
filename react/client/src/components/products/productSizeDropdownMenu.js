import Dropdown from 'react-bootstrap/Dropdown';

function ProductSizeDropdownMenu(sizeListMap, requested_product_id, handleSizeSelection) {

    const dropdown = document.querySelector('.dropdown-menu');

    if(dropdown){
        const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            const button = item.querySelector('.dropdown-item-button');
            button.removeEventListener('click', button._handleClick);
            button.addEventListener('click', () => {
                const eventKey = JSON.parse(button.getAttribute('eventkey'));
                handleSizeSelection(eventKey.productId, eventKey.size);
            });
        });
    }


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
        const my_key = relevant_product_sizes[i].size + "-dropdown-item-" + relevant_product_sizes.title;
        htmlSizeList.push(
            <Dropdown.Item
                key={my_key}
                role="">

                <button
                type="button"
                className="dropdown-item-button"
                eventkey={JSON.stringify({ productId: requested_product_id, size: relevant_product_sizes[i].size })}
                onClick={() => handleSizeSelection(requested_product_id, relevant_product_sizes[i].size)}
                >
                {relevant_product_sizes[i].size}
                </button>

            </Dropdown.Item>
            );

    };

    // return all HTML elements as an object (which can be iterated thru)
    return htmlSizeList;

}

export default ProductSizeDropdownMenu;