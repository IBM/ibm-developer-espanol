package org.ibm.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibm.cloud.cloudant.v1.Cloudant;
import com.ibm.cloud.cloudant.v1.model.AllDocsResult;
import com.ibm.cloud.cloudant.v1.model.DeleteDocumentOptions;
import com.ibm.cloud.cloudant.v1.model.DocsResultRow;
import com.ibm.cloud.cloudant.v1.model.Document;
import com.ibm.cloud.cloudant.v1.model.DocumentResult;
import com.ibm.cloud.cloudant.v1.model.GetDocumentOptions;
import com.ibm.cloud.cloudant.v1.model.PostAllDocsOptions;
import com.ibm.cloud.cloudant.v1.model.PutDocumentOptions;

import org.ibm.model.Book;

@ApplicationScoped
public class BookRepository {
    @Inject
    Cloudant cloudantClient;

    String dbName = "books";

    public List<Book> list() throws JsonMappingException, JsonProcessingException {
        PostAllDocsOptions docsOptions = new PostAllDocsOptions.Builder().db(dbName).includeDocs(true).build();
        AllDocsResult response = cloudantClient.postAllDocs(docsOptions).execute().getResult();
        
        List<Book> books = new ArrayList<Book>();
        for(DocsResultRow row : response.getRows()) {
            Book book = new ObjectMapper().readValue(row.getDoc().toString(), Book.class);
            books.add(book);
        }

        return books;
    }

    public Book findById(String id) throws JsonMappingException, JsonProcessingException {
        GetDocumentOptions documentOptions = new GetDocumentOptions.Builder().db(dbName).docId(id).build();
        Document response = cloudantClient.getDocument(documentOptions).execute().getResult();
        
        Book book = new ObjectMapper().readValue(response.toString(), Book.class);

        return book;
    }

    public Book create(Book book) throws JsonMappingException, JsonProcessingException {
        UUID docId = UUID.randomUUID();
        return createOrUpdate(book, docId.toString());
    }

    public Book update(Book book) throws JsonMappingException, JsonProcessingException {
        return createOrUpdate(book, book.get_id());
    }
    
    private Book createOrUpdate(Book book, String docId) throws JsonMappingException, JsonProcessingException {
        // Deserializar el modelo Book a el modelo Document
        ObjectMapper objectMapper = new ObjectMapper();
        String bookAsString = objectMapper.writeValueAsString(book);

        Document doc = new Document();
        doc.setProperties(new ObjectMapper().readValue(bookAsString, Map.class));

        
        PutDocumentOptions documentOptions = new PutDocumentOptions.Builder().db(dbName).docId(docId).document(doc).build();
        DocumentResult response = cloudantClient.putDocument(documentOptions).execute().getResult();
        book.set_id(response.getId());
        book.set_rev(response.getRev());
		return book;
    }

    public void delete(Book book) {
        DeleteDocumentOptions documentOptions = new DeleteDocumentOptions.Builder().db(dbName).docId(book.get_id()).rev(book.get_rev()).build();
        DocumentResult response = cloudantClient.deleteDocument(documentOptions).execute().getResult();
        System.out.println(response);
    }
}
