package org.acme.s3;


import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.resteasy.annotations.jaxrs.PathParam;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;


import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

@Path("/s3")
public class FileObjectResource {

    @Inject
    @ConfigProperty(name = "cos-bucket-name")
    String bucketName;

    @Inject
    S3Client s3;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<FileObject> listObjects() {
        ListObjectsRequest listRequest = ListObjectsRequest
                .builder()
                .bucket(bucketName)
                .build();
        return s3.listObjects(listRequest).contents().stream()
                .sorted(Comparator.comparing(S3Object::lastModified).reversed())
                .map(FileObject::from).collect(Collectors.toList());
    }

    @GET
    @Path("download/{objectKey}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadObject(@PathParam("objectKey") String objectKey) {
        try {
            ByteArrayOutputStream byteArray = new ByteArrayOutputStream();
            GetObjectResponse getResponse = s3.getObject(GetObjectRequest
                            .builder()
                            .bucket(bucketName)
                            .key(objectKey)
                            .build(),
                    ResponseTransformer.toOutputStream(byteArray));

            Response.ResponseBuilder response = Response.ok((StreamingOutput) output -> byteArray.writeTo(output)).status(Response.Status.OK);
            return response.build();
        } catch (Exception ex){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    @DELETE
    @Path("delete/{objectKey}")
    public Response deleteObject(@PathParam("objectKey") String objectKey) {
        try{
            DeleteObjectRequest deleteRequest = DeleteObjectRequest
                    .builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();
            s3.deleteObject(deleteRequest);

            Response.ResponseBuilder response = Response.ok().status(Response.Status.OK);
            return response.build();
        }catch (Exception ex){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
    }

    @POST
    @Path("upload/{objectKey}")
    public Response uploadObject(@PathParam("objectKey") String objectKey, String url) throws MalformedURLException, IOException {
        if (url.isEmpty() || url == null ) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        File tempPath;
        InputStream input = new URL(url).openStream();
        try {
            tempPath = File.createTempFile("uploadS3Tmp", ".tmp");
            Files.copy(input, tempPath.toPath(), StandardCopyOption.REPLACE_EXISTING);

            PutObjectResponse putResponse = s3.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(objectKey)
                            .build(),
                    RequestBody.fromFile(tempPath)
            );
            return Response.ok().status(Response.Status.CREATED).build();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

}