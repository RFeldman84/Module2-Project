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





// window.addEventListener('load', ()=>{
//  const upF = document.querySelector('.upF')
//  upF.classList.toggle('hide', true)
//   const editF = document.querySelector('.editF')
//   editF.addEventListener('click', ()=>{
//     upF.classList.toggle('hide')
//   })
// })

