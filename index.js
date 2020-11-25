const express = require('express');
const morgan = require('morgan');
const yup = require('yup')
const monk = require('monk')


const {nanoid} = require('nanoid')

require('dotenv').config();

const db = monk(process.env.MONGO_URI);
const urls = db.get('urls');
urls.createIndex({slug: 1}, {unique: true});



const app = express();
// a


app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static('./public'));

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/^[\w\-]+$/i),
    url: yup.string().trim().url().required(),
});

// app.get('/url/:id', (req, res)=>{
//     // TODO: get a short url by id


// })

app.get('/:id',  async (req, res, next)=>{
    // TODO: redirect to url
    const { id: slug } = req.params;
    try{
        const url = await urls.findOne({slug});
        if (url){
            res.redirect(url.url);
        }

        res.redirect(`/?error=${slug} not found`);
    }catch(error){
        res.redirect(`/?error=Link not found`);
    }
   

})


app.post('/url', async(req, res, next)=>{
    // TODO: create a  redirect to url
    let {slug, url} = req.body;
    try{
        await schema.validate({
            slug, url,
        })
        if(!slug | slug == ""){
            slug = nanoid(5);
        }
        slug = slug.toLowerCase();
        const newUrl = {
            url, slug, 
        }
        const created = await urls.insert(newUrl);
        res.json(created);

    }catch(error){
        if(error.message.startsWith('E11000')){
            error.message = 'Slug in use 😢'
        }

        next(error);
    }

})

app.use((error, req, res, next)=>{
    if (error.status){
        res.status(error.status);
    }else{
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'woops 😢' : error.stack,
    })
})


const port = process.env.PORT || 1337;
app.listen(port, ()=>{
    console.log(`Listening at http://localhost:${port}`);
});