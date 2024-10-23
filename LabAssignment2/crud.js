$(document).ready(function () {
    const apiKey = 'live_OTibkOxK68klxhefjpKextJBQ92Q7XWFnnVuHEugjSEcxknvSVD8VM68dtqbxX0y'; 
    const apiUrl = 'https://api.thecatapi.com/v1/images/search?limit=9';
    const favoritesUrl = 'https://api.thecatapi.com/v1/favourites';
    let furryFriends = JSON.parse(localStorage.getItem("friends")) || [];

    function generateFakeCatData() {
        const name = ['Whiskers', 'Shadow', 'Luna', 'Simba', 'Tigger', 'Oliver', 'Mittens', 'Cleo', 'Nala', 'Sassy', 'Smokey', 'Felix', 'Bella', 'Ginger', 'Milo', 'Oreo', 'Mochi', 'Pepper', 'Paws', 'Tiger', 'Muffin', 'Casper', 'Salem', 'Buttons', 'Socks'];
        const breeds = ['Siamese', 'Persian', 'Maine Coon', 'Bengal', 'Sphynx', 'British Shorthair'];
        const colors = ['Black', 'White', 'Gray', 'Brown', 'Ginger', 'Calico'];
        const interests = ['Napping', 'Chasing Toys', 'Sunbathing', 'Bird Watching', 'Cuddling', 'Exploring', 'Playing with String'];
        
        return {
            breed: breeds[Math.floor(Math.random() * breeds.length)],
            name: name[Math.floor(Math.random() * name.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            age: Math.floor(Math.random() * 15) + 1,
            interests: interests.sort(() => 0.5 - Math.random()).slice(0, 3).join(', ')
        };
    }

    function fetchCats() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            headers: {
                'x-api-key': apiKey
            },
            success: function (data) {
                displayCats(data);
            },
            error: function (error) {
                console.error('Error fetching cat data:', error);
            }
        });
    }

    function displayCats(cats) {
        cats.forEach(cat => {
            const fakeData = generateFakeCatData();
            const catCard = `
                <div class="card col-md-3 m-2 col-12 h-custom-1" style="width: 18rem;">
                <div class="h-custom">
                  <img src="${cat.url}" class="card-img-top h-100 w-100" alt="Cute Cat">
                </div>
                    <div class="card-body">
                        <h5 class="card-title">${fakeData.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Nickname: <span class="alias">None</span></h6>
                        <p class="card-text">
                            Breed: ${fakeData.breed}<br>
                            Color: ${fakeData.color}<br>
                            Age: ${fakeData.age} years<br>
                            Location: Catlandia
                        </p>
                        <p><strong>Interests:</strong> ${fakeData.interests}</p>
                        <a class="btn add-friend button-hover" data-id="${cat.id}" data-url="${cat.url}" 
                           data-breed="${fakeData.breed}" data-name="${fakeData.name}" data-color="${fakeData.color}" 
                           data-age="${fakeData.age}" data-interests="${fakeData.interests}">
                           Add Friend
                        </a>
                    </div>
                </div>
            `;
            $('#cat-list').append(catCard);
        });
    }

    $(document).on('click', '.add-friend', function (e) {
        e.preventDefault();
        const catId = $(this).data('id');
        const catUrl = $(this).data('url');
        const name = $(this).data('name');
        const breed = $(this).data('breed');
        const color = $(this).data('color');
        const age = $(this).data('age');
        const interests = $(this).data('interests');
        const alias = prompt('Enter an alias for this cat:');

        if (alias) {
            const rawBody = JSON.stringify({
                "image_id": catId,
            });
            
            $.ajax({
                url: favoritesUrl,
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                },
                data: rawBody,
                success: function (result) {
                    const friend = { id: result.id, alias: alias, url: catUrl, name, breed, color, age, interests };
                    furryFriends.push(friend);
                    localStorage.setItem("friends", JSON.stringify(furryFriends));
                    displayFurryFriends();
                },
                error: function (error) {
                    console.error('Error adding favorite:', error);
                    alert("Couldn't add friend. Try again!");
                }
            });
        }
    });

    function displayFurryFriends() {
        $('#favorites-list').empty();
        furryFriends.forEach(friend => {
            const friendCard = `
                <div class="card col-md-3 m-2 col-12 h-custom-1" style="width: 18rem;">
                <div class='h-custom'>
                  <img src="${friend.url}" class="card-img-top h-100" alt="Cute Cat">
                </div>
                    <div class="card-body">
                        <h5 class="card-title">${friend.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Nickname: <span class="alias">${friend.alias}</span></h6>
                        <p class="card-text">
                            Breed: ${friend.breed}<br>
                            Color: ${friend.color}<br>
                            Age: ${friend.age} years<br>
                            Location: Catlandia
                        </p>
                        <p><strong>Interests:</strong> ${friend.interests}</p>
                        <a class="btn edit-alias button-hover" data-id="${friend.id}">Edit Alias</a>
                        <a class="btn btn-danger remove-friend unfriend-button-hover" href="#" data-id="${friend.id}">Declaw the Friendship!</a>
                    </div>
                </div>
            `;
            $('#favorites-list').append(friendCard);
        });
    }
    $(document).on('click', '.edit-alias', function (e) {
        e.preventDefault();
        const favoriteId = $(this).data('id');
        const friend = furryFriends.find(f => f.id === favoriteId);
        if (friend) {
            const newAlias = prompt('Enter a new alias for this cat:', friend.alias);
            if (newAlias) {
                friend.alias = newAlias;
                localStorage.setItem("friends", JSON.stringify(furryFriends));
                displayFurryFriends();
            }
        }
    });

    $(document).on('click', '.remove-friend', function (e) {
        e.preventDefault();
        const favoriteId = $(this).data('id');

        $.ajax({
            url: `${favoritesUrl}/${favoriteId}`,
            method: 'DELETE',
            headers: {
                'x-api-key': apiKey
            },
            success: function () {
                furryFriends = furryFriends.filter(f => f.id !== favoriteId);
                localStorage.setItem("friends", JSON.stringify(furryFriends)); 
                displayFurryFriends();
            },
            error: function (error) {
                console.error('Error deleting favorite:', error);
                alert("Couldn't remove friend. Try again!");
            }
        });
        alert('Un-fur-gettable Goodbye!');
    });
    
    displayFurryFriends();
    fetchCats();
});
