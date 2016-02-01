using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using ShareIt.Models;

namespace ShareIt.Controllers
{
    public class ResourceController : ApiController
    {
        private ShareResourcesEntities db = new ShareResourcesEntities();

        // GET: api/Resource
        public IQueryable<Resource> GetResources()
        {
            return db.Resources;
        }

        // GET: api/Resource/5
        [ResponseType(typeof(IQueryable<Resource>))]
        public IHttpActionResult GetResource(int id)
        {
            IQueryable<Resource> resources = db.Resources.Where(r => r.StudentId == id);
            if (resources.Count() == 0)
            {
                return NotFound();
            }

            return Ok(resources);
        }

        // PUT: api/Resource/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutResource(int id, Resource resource)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != resource.Id)
            {
                return BadRequest();
            }

            db.Entry(resource).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResourceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Resource
        [ResponseType(typeof(Resource))]
        public async Task<IHttpActionResult> PostResource(Resource resource)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Resources.Add(resource);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = resource.Id }, resource);
        }

        // DELETE: api/Resource/5
        [ResponseType(typeof(Resource))]
        public async Task<IHttpActionResult> DeleteResource(int id)
        {
            Resource resource = await db.Resources.FindAsync(id);
            if (resource == null)
            {
                return NotFound();
            }

            db.Resources.Remove(resource);
            await db.SaveChangesAsync();

            return Ok(resource);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ResourceExists(int id)
        {
            return db.Resources.Count(e => e.Id == id) > 0;
        }
    }
}