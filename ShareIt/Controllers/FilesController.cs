using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace ShareIt.Controllers
{
    internal struct FileData
    {
        public string name { get; set; }
        public string StudentId { get; set; }
        public string link { get; set; }
    }

    public class FilesController : ApiController
    {
        // GET api/Files/5
        [ResponseType(typeof(IQueryable<FileData>))]
        public IHttpActionResult Get(int id)
        {
            string root = HttpContext.Current.Server.MapPath("~/App_Data/uploads");
            string dirPath = Path.Combine(root, id.ToString());
            if (!Directory.Exists(dirPath))
            {
                return NotFound();
            }

            IEnumerable<string> files = Directory.EnumerateFiles(dirPath);
            IEnumerable<FileData> fileDatas = files.Select(x =>
            {
                FileInfo y = new FileInfo(x);
                return new FileData
                {
                    StudentId = id.ToString(),
                    name = y.Name,
                    link = string.Format("/api/Files?studentId={0}&fileName={1}", id, y.Name)
                };
            });

            if (fileDatas.Count() == 0)
            {
                return NotFound();
            }

            return Ok(fileDatas);
        }

        // GET api/Files?studentId=1&fileName=x.jpg
        [HttpGet]
        public HttpResponseMessage Get(int studentId, string fileName)
        {
            string root = HttpContext.Current.Server.MapPath("~/App_Data/uploads");
            string path = Path.Combine(root, studentId.ToString(), fileName);
            if (File.Exists(path))
            {
                HttpResponseMessage result = Request.CreateResponse(HttpStatusCode.OK);
                result.Content = new StreamContent(new FileStream(path, FileMode.Open, FileAccess.Read));
                result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentDisposition.FileName = fileName;
                return result;
            }

            return Request.CreateResponse(HttpStatusCode.NotFound);
        }

        // POST api/Files
        [HttpPost]
        public async Task<HttpResponseMessage> Post()
        {
            HttpRequestMessage request = this.Request;
            if (!request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            string root = HttpContext.Current.Server.MapPath("~/App_Data/uploads");
            Directory.CreateDirectory(root);

            var provider = new MultipartFormDataStreamProvider(root);
            var result = await request.Content.ReadAsMultipartAsync(provider);
            MultipartFileData fileData = result.FileData.First();
            FileInfo uploadedFileInfo = new FileInfo(fileData.LocalFileName);
            string[] names = fileData.Headers.ContentDisposition.Name.Trim(new Char[] { '\\', '\"' }).Split(new Char[] { '<' });
            string newFolder = Path.Combine(uploadedFileInfo.Directory.ToString(), names[0]);
            Directory.CreateDirectory(newFolder);
            string newName = Path.Combine(newFolder, names[1]);

            if (File.Exists(newName))
                File.Delete(newName);

            File.Move(uploadedFileInfo.FullName, newName);

            return this.Request.CreateResponse<FileData>(HttpStatusCode.Created,
                new FileData
                {
                    StudentId = names[0],
                    name = names[1],
                    link = string.Format("/api/Files?studentId={0}&fileName={1}", names[0], names[1])
                });
        }
    }
}