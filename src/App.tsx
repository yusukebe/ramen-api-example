import React, { useState, useEffect } from 'react'
import { Routes, Route, useParams, Link } from 'react-router-dom'

const END_POINT = 'https://ramen-api.dev'

type Photo = {
  name: string
  url: string
  width: number
  height: number
  authorId: string
}

type Shop = {
  id: string
  name: string
  photos: Photo[]
}

type Author = {
  id: string
  name: string
  url: string
}

const AuthorRedirector = () => {
  type Params = {
    authorId: string
  }

  type Data = {
    author: Author
  }
  const [author, setAuthor] = useState<Author>()
  const { authorId } = useParams<Params>()
  const apiRequest = (): Promise<Data> =>
    fetch(`${END_POINT}/authors/${authorId}`).then((x) => x.json())

  useEffect(() => {
    apiRequest().then((data) => {
      setAuthor(data.author)
    })
  }, [authorId])

  return (
    <>
      {author && (
        <p>
          <a href={author.url}>{author.name}</a>
        </p>
      )}
    </>
  )
}

const ShopPage = () => {
  type Params = {
    shopId: string
  }

  type Data = {
    shop: Shop
  }
  const [shop, setShop] = useState<Shop>()
  const { shopId } = useParams<Params>()
  const apiRequest = (): Promise<Data> =>
    fetch(`${END_POINT}/shops/${shopId}`).then((x) => x.json())

  useEffect(() => {
    apiRequest().then((data) => {
      setShop(data.shop)
    })
  }, [shopId])

  const Images = (props: { photos: Photo[] }) => {
    return (
      <>
        {props.photos.map((photo) => {
          let { width, height } = photo
          const fixedWidth = 300
          const ratio = fixedWidth / width
          height = height * ratio
          return (
            <div>
              <p>
                <img src={`${photo.url}`} width={fixedWidth} height={height} />
                <br />
                <i>
                  Photo by&nbsp;<Link to={`/authors/${photo.authorId}`}>{photo.authorId}</Link>
                </i>
              </p>
            </div>
          )
        })}
      </>
    )
  }

  return (
    <>
      <h2>Shop page: {shop ? shop.name : ''}</h2>
      {shop && <Images photos={shop.photos} />}
    </>
  )
}

const HomePage = () => {
  type Data = {
    shops: Shop[]
    totalCount: number
  }

  const [shops, setShops] = useState<Shop[]>([])
  const [totalCount, setTotalCount] = useState(0)

  const apiRequest = (): Promise<Data> => fetch(`${END_POINT}/shops`).then((x) => x.json())

  useEffect(() => {
    apiRequest().then((data) => {
      setShops(data.shops)
      setTotalCount(data.totalCount)
    })
  }, [])

  return (
    <>
      <h2>Total: {totalCount} shops</h2>
      <ul>
        {shops.map((shop) => {
          return (
            <li>
              <Link to={`/shops/${shop.id}`}>{shop.id}</Link>
            </li>
          )
        })}
      </ul>
      <Routes>
        <Route path='/shops/:shopId' element={<ShopPage />} />
      </Routes>
    </>
  )
}

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/shops/:shopId' element={<ShopPage />} />
        <Route path='/authors/:authorId' element={<AuthorRedirector />} />
      </Routes>
    </>
  )
}

export default App
