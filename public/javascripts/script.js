document.addEventListener(
	"DOMContentLoaded",
	() => {
		console.log("IronGenerator JS imported successfully!")
	},
	false
)

const favForms = document.querySelectorAll(".fav-form")

favForms.forEach(form => {
	//console.log(`clicked`)

	const favBtn = form.querySelector("#fav-btn")

	const favId = form.querySelector("input").value

	if (favId === "yes") {
		favBtn.innerHTML = `<img height="25" src="/images/bookmarked.png" alt="bookmarked">`
	} else if (favId === "no") {
		favBtn.innerHTML = `<img height="25" src="/images/bookmark-open.png" alt="not bookmarked">`
	}
})

// not bookmarked
// `<img height="25" src="/images/bookmark-open.png" alt="not bookmarked">`


// bookmarked ** remember to change on bookmarks.hbs
// `<img height="25" src="/images/bookmarked.png" alt="bookmarked">`




const editBtn = document.querySelectorAll(".editF")
const upForm = document.querySelectorAll('.upF')


for(let i = 0; i< editBtn.length;i++){
	editBtn[i].addEventListener('click', (e)=>{
		console.log(`clicked`, e.target)
		upForm[i].classList.toggle('hide')
		console.log(upForm[i])
	})
}
	
	
