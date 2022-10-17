async function getOwner(userId) {
    const res = await fetch(`/user/user/${userId}`)
    if (res.ok) {
        let data = await res.json()
        return data.data
    } else {
        return null
    }

}

async function getUserPosts() {
    const res = await fetch(`/post/my-posts`)
    let itemsDetail = await res.json()
    console.log("items" + itemsDetail)


    if (res.ok) {

        addItemsInUserPost(itemsDetail)

    }
    // $grid.isotope();

}




function addItemsInUserPost(itemsDetail) {
    let itemContainerUser = document.querySelector('.lost-items-container')
    itemContainerUser.innerHTML = ''
    let counter = 0


    for (let item of itemsDetail) {
        let itemStatus = []
        let itemStatusInPage = "Pending"
        if (item.type == "found" || item.type == "Found") {
            itemStatus = ["Not returned", "Returned"]
        }
        if (item.type == "lost" || item.type == "Lost") {
            itemStatus = ["Not found", "Found"]
        }
        if (item.status == "true") {
            itemStatusInPage = itemStatus[1]
        } else {
            itemStatusInPage = itemStatus[0]
        }


        itemContainerUser.innerHTML +=  /*HTML */`
        <div class="col-md-4 item-wrapper ${item.type ? 'lost' : 'found'}">
              <div class="card-box-a card-shadow">
                <div class="img-box-a">
                  <img
                    src="/${item.image}"
                    alt="" class="img-a img-fluid">
                </div>
                <div class="card-overlay">
                  <div class="card-overlay-a-content">
                    <div class="card-header-a">
                      <h2 class="card-title-a">
                        <a href="#">${item.name}
  
                      </h2>
                    </div>
                    <div class="card-body-a">
                      <div class="price-box d-flex">
                      ${item.is_free ? ' <span class="price-a">FREE</span> ' : '<span class="price-a">Need Fee</span> '}
                       
                      </div>
                      <a href="/item-single.html?itemId=${item.id}" class="link-a">Click here to view
                        <span class="bi bi-chevron-right"></span>
                      </a>
                    </div>
                    <div class="card-footer-a">
                      <ul class="card-info d-flex justify-content-around">
                  
                        <li>
                          <h4 class="card-info-title">Category</h4>
                          <span>${item.category}</span>
                        </li>
                        <li>
                          <h4 class="card-info-title">Date of Lost</h4>
                          <span>${item.happened_at.substring(0, 10)}</span>
                        </li>
                        <li>
                          <h4 class="card-info-title">Status</h4>
                          <span>${itemStatusInPage}</span>
                          
                        </li>
                      </ul>
                    </div>
                    <div class="delete-btn" data_index="${item.id}">
					<i data_index="${item.id}"> DELETE </i>
				</div>
                  </div>
                </div>
              </div>
            </div>
        `
        counter++
    }
    const itemsContainer = document.querySelectorAll('.lost')
    for (let itemDiv of itemsContainer) {
        setEventListenerOnItemDiv(itemDiv)
    }

    if (counter == 0) {
        let noDataContainer = document.querySelector('.no-data-section')
        noDataContainer.innerHTML = `<section class="notification-section">
                                     <h1>No your posts</h1>
                                      </section>`
    }



}




function setEventListenerOnItemDiv(itemDiv) {
    const deleteBtn = itemDiv.querySelector('.delete-btn')

    deleteBtn.addEventListener('click', async (e) => {
        // Call Delete API
        const element = e.target
        const data_index = element.getAttribute('data_index')
        console.log(data_index)
        let result = window.confirm("Are you sure to delete this item?\n")
        if (result) {
            const res = await fetch('/items/del-my-posts', {
                method: 'DELETE',
                body: JSON.stringify({
                    index: data_index
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
            if (res.ok) {
                window.location.reload()

                getUserPosts()
            }
        } else { }

    })
}

getUserPosts()