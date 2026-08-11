// Simple JS: carousel, product generation, search
const slidesEl = document.querySelector('.carousel .slides');
const dotsEl = document.getElementById('dots');
let current = 0;
const total = slidesEl ? slidesEl.children.length : 0;

function goTo(i){
  if(!slidesEl) return;
  current = (i + total) % total;
  slidesEl.style.transform = `translateX(${-current * 100}%)`;
  Array.from(dotsEl.children).forEach((b,idx)=> b.classList.toggle('active', idx===current));
}

function initCarousel(){
  if(!slidesEl) return;
  for(let i=0;i<total;i++){
    const btn = document.createElement('button');
    btn.addEventListener('click',()=>goTo(i));
    if(i===0) btn.classList.add('active');
    dotsEl.appendChild(btn);
  }
  setInterval(()=>goTo(current+1),4000);
}

// sample products
const products = Array.from({length:12}).map((_,i)=>({
  id:i+1,
  title:`示例商品 ${i+1} - 热销`,
  price:(Math.random()*900+100).toFixed(2),
  img:`https://picsum.photos/seed/p${i+1}/400/300`
}))

function renderProducts(){
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="title">${p.title}</div>
      <div class="price">¥${p.price}</div>
      <button data-id="${p.id}">加入购物车</button>
    `;
    grid.appendChild(card);
  });
  grid.addEventListener('click',e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const id = btn.dataset.id;
    alert('已添加到购物车：' + id);
  })
}

// search
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
searchBtn?.addEventListener('click',()=>{
  const q = searchInput.value.trim();
  if(!q) return alert('请输入搜索关键词');
  alert('搜索: ' + q);
})

// init
document.addEventListener('DOMContentLoaded',()=>{
  initCarousel();
  renderProducts();
});
