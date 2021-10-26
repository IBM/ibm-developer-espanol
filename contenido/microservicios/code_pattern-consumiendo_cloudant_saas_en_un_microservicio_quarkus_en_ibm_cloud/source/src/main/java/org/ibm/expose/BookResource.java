package org.ibm.expose;

import java.io.IOException;
import java.util.List;

import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.NotFoundException;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.ibm.model.Book;
import org.ibm.repository.BookRepository;

@Path("/book")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookResource {
    @Inject
    BookRepository bookRepository;

    @GET
    public List<Book> list() throws IOException {
        return bookRepository.list();
    }

    @GET
    @Path("/{id}")
    public Book get(@PathParam("id") String id) throws IOException {
        return bookRepository.findById(id);
    }

    @POST
    @Transactional
    public Book create(Book book) throws IOException {
        return bookRepository.create(book);
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Book update(@PathParam("id") String id, Book book) throws IOException {
        Book entity = bookRepository.findById(id);
        if(entity == null) {
            throw new NotFoundException();
        }
        entity.setName(book.getName());
        entity.setAuthor(book.getAuthor());
        return bookRepository.update(entity);
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") String id) throws IOException {
        Book entity = bookRepository.findById(id);
        if(entity == null) {
            throw new NotFoundException();
        }
        bookRepository.delete(entity);
    }
}