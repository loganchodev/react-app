import './App.css';
import {useState} from 'react';

function Header(props){
  
  //console.log('props', props.title)

  return(
    <header>
       <h1><a href="/" onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode();
       }}>{props.title}</a></h1>
    </header>
  )
}

function Nav(props){
  const lis = []

  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a>
    </li>);
  }
  return(
    <nav>
        <ol>
          {lis}
        </ol>
      </nav>
  )
}

function Article(props){
  
  return(
    <article>
        <h2>{props.title}</h2>
        {props.body}
      </article>
  )
}

function Create (props){

  return(
    <article>
      <h2>Create</h2>
      <form onSubmit={event=>{
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type="text" name="title" placeholder='title' /></p>
        <p><textarea placeholder='body' name="body"/></p>
        <p><input type="submit" value="Create"></input></p>
      </form>
    </article>
  )
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return(
    <article>
      <h2>Update</h2>
      <form onSubmit={event=>{
        event.preventDefault();
        props.onUpdate(title, body);
      }}>
        <p><input type="text" name="title" placeholder='title' value={title} onChange={event=>{
          setTitle(event.target.value);
        }}/></p>
        <p><textarea placeholder='body' name="body" value={body} onChange={event=>{
          setBody(event.target.value);
        }}/></p>
        <p><input type="submit" value="Update"></input></p>
      </form>
    </article>
  )
}

function App() {

  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]);

  let content = null;
  let contextControl = null;
  let selectedTopic = {title:'', body:''};

  if(mode === 'READ' || mode === 'UPDATE') {
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        selectedTopic = topics[i];
        break;
      }
    }
  }

  if(mode === 'WELCOME'){
    content = <Article title="welcome" body="Hello, web"></Article>
  } else if(mode === 'READ') {
    content = <Article title={selectedTopic.title} body={selectedTopic.body}></Article>
    contextControl = <li><a href={"/update/"+id} onClick={event=>{
      event.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>
  } else if (mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body};
      const newTopics = [...topics, newTopic];
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if (mode === 'UPDATE'){
    content = <Update title={selectedTopic.title} body={selectedTopic.body} onUpdate={(title, body)=>{
      console.log(title, body);
      const newTopics = [...topics];
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
    }}></Update>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(id)=>{
        setMode('READ');
        setId(id);
      }}></Nav>
      {content}
      <ul>
        <li><a href='/create' onClick={event=>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}



export default App;